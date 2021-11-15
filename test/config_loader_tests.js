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
    const newConfigFile = path.join(CONFIGFOLDER, '3.yaml')
    const conf3 = `
domains:
  - api.domain3.cz
`
const conf3Updated = `
domains:
  - api.domain3.cz
cors:
  - web1.domain3.cz
`

    before(done => {
      Emiter = ConfigLoader(CONFIGFOLDER)
      Emiter.once('loaded', configs => {
        configs[1].domains.length.should.eql(1)
        configs[1].domains[0].should.eql('api.domain1.cz')
        configs[1].cors.length.should.eql(2)
        configs[1].cors[1].should.eql('web2.domain1.cz')
        done()
      })
    })

    it('shall emit changed event with new config', (done) => {
      Emiter.once('changed', (orgid, configs) => {
        orgid.should.eql(3)
        configs[3].domains[0].should.eql('api.domain3.cz')
        done()
      })
      fs.promises.writeFile(newConfigFile, conf3, 'utf8')
    })

    it('shall emit changed event on existing config', (done) => {
      Emiter.once('changed', (orgid, configs) => {
        orgid.should.eql(3)
        configs[3].domains[0].should.eql('api.domain3.cz')
        configs[3].cors[0].should.eql('web1.domain3.cz')
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
