/* global describe it */
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
const chai = require('chai')
chai.should()

import InitConfigLoader from '../config/loader'
const CONFIGFOLDER = path.join(__dirname, 'test_configs')

module.exports = (g) => {
  //
  const r = chai.request(`http://localhost:${process.env.PORT}`)
  
  return describe('config', () => {
    const changes = {}
    let configs = null
    const newConfigFolder = path.join(CONFIGFOLDER, 'org3')
    const conf3 = `
domains:
  - api.domain3.cz
`
const conf3Updated = `
domains:
  - api.domain3.cz
cors: http://web1.domain3.cz
`

    before(async () => {
      configs = await InitConfigLoader(CONFIGFOLDER, (orgid, config) => {
        changes[orgid] = config
      })
      configs[0].domains.length.should.eql(1)
      configs[0].domains[0].should.eql('api.domain1.cz')
      configs[0].cors.should.eql('https://web1.domain1.cz,http://web2.domain1.cz')
    })

    it('shall emit changed event with new config', (done) => {
      fs.mkdirSync(newConfigFolder)
      fs.promises.writeFile(path.join(newConfigFolder, 'setting.yaml'), conf3, 'utf8')
      setTimeout(() => {
        changes.org3.domains[0].should.eql('api.domain3.cz')
        delete changes.org3
        done()
      }, 1900)
    })

    it('shall emit changed event on existing config', (done) => {
      fs.promises.writeFile(path.join(newConfigFolder, 'setting.yaml'), conf3Updated, 'utf8')
      setTimeout(() => {
        changes.org3.domains[0].should.eql('api.domain3.cz')
        changes.org3.cors.should.eql('http://web1.domain3.cz')
        delete changes.org3
        done()
      }, 1900)
    })

    after(done => {
      rimraf.sync(newConfigFolder)
      done()
    })

  })
}
