/* global describe before after */
// const fs = require('fs')
import express from 'express'
import chai from 'chai'
import sessionServiceMockInitializer from '../mocks/sessionService.js'
import loginMockRoute from '../mocks/loginRoute.js'
import initErrorHandlers from '../error_handlers'
import { required, requireMembership } from '../auth'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const g = {
  app: express(),
  mockUser: {},
  sessionBasket: []
}

g.app.get('/require', required, (req, res, next) => {
  res.json(req.user)
})
g.app.get('/requireMembership', required, requireMembership('admins'), 
    (req, res, next) => {
  res.json(req.user)
})
g.app.use('/auth', loginMockRoute(g.mockUser))
initErrorHandlers(g.app)


describe('app', () => {
  before(done => {
    g.server = g.app.listen(process.env.PORT, '127.0.0.1', (err) => {
      if (err) return done(err)
      setTimeout(done, 1500)
    })
    g.sessionServiceMock = 
      sessionServiceMockInitializer(5000, g)
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
  })

  describe('API', () => {
    //
    const submodules = [
      './auth'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
