import chai from 'chai'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const g = require('./utils/init').init()

describe('app', () => {
  before(done => {
    g.server = g.app.listen(process.env.PORT, '127.0.0.1', (err) => {
      if (err) return done(err)
      setTimeout(done, 1500)
    })
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
  })

  describe('API', () => {
    const submodules = [
      './auth_tests',
      './config_loader_tests',
      './errors_tests',
      // './orgconfig_tests'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
