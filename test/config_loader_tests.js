/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()
// import _ from 'underscore'

import ConfigLoader from '../configloader'
const CONFIGFOLDER = path.join(__dirname, 'test_configs')

module.exports = (g) => {
  //
  const r = chai.request(`http://localhost:${process.env.PORT}`)
  
  return describe('config', () => {

    let Emiter = null
    const newConfigFile = path.join(CONFIGFOLDER, 'org3.yaml')
    const conf3 = `
domains:
  - api.domain3.cz
`
const conf3Updated = `
domains:
  - api.domain3.cz
cors: http://web1.domain3.cz
`

    before(done => {
      Emiter = ConfigLoader(CONFIGFOLDER)
      Emiter.once('loaded', configs => {
        configs.org1.domains.length.should.eql(1)
        configs.org1.domains[0].should.eql('api.domain1.cz')
        configs.org1.cors.should.eql('https://web1.domain1.cz,http://web2.domain1.cz')
        done()
      })
    })

    it('shall emit changed event with new config', (done) => {
      Emiter.once('changed', (orgid, configs) => {
        orgid.should.eql('org3')
        configs.org3.domains[0].should.eql('api.domain3.cz')
        done()
      })
      fs.promises.writeFile(newConfigFile, conf3, 'utf8')
    })

    it('shall emit changed event on existing config', (done) => {
      Emiter.once('changed', (orgid, configs) => {
        orgid.should.eql('org3')
        configs.org3.domains[0].should.eql('api.domain3.cz')
        configs.org3.cors.should.eql('http://web1.domain3.cz')
        done()
      })
      fs.promises.writeFile(newConfigFile, conf3Updated, 'utf8')
    })

    after(done => {
      fs.unlinkSync(newConfigFile)
      done()
    })

  })
}
