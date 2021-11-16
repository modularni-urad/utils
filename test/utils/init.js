import path from 'path'
import express from 'express'
import loginMockRoute from '../mocks/loginRoute.js'
import sessionServiceMockInitializer from '../mocks/sessionService.js'
import initErrorHandlers from '../../error_handlers'

process.env.PORT = 33333
process.env.SESSION_SERVICE = 'http://localhost:5000'
process.env.NODE_ENV = 'test'
process.env.SESSION_COOKIE_NAME = 'Bearer'

export function init() {
  const auth = require('../../auth').default
  const OrgConfig = require('../../config')

  const g = {
    app: express(),
    mockUser: {},
    sessionBasket: []
  }
  g.sessionServiceMock = sessionServiceMockInitializer(5000, g)
  g.setupOrgConfigs = OrgConfig.setup

  g.app.get('/require', auth.session, auth.required, (req, res, next) => {
    res.json(req.user)
  })
  g.app.get('/requireMembership', auth.session, auth.requireMembership('admins'),
    (req, res, next) => {
      res.json(req.user)
    })
  g.app.get('/error', (req, res, next) => {
    throw new Error('ouch')
  })
  const loadOrgConfig = OrgConfig.createloadOrgConfig(req => req.hostname)
  g.app.get('/domainsensitive', loadOrgConfig, (req, res, next) => {
    res.json(req.orgconfig)
  })

  g.app.use('/login', loginMockRoute(g.mockUser))

  initErrorHandlers(g.app)

  return g
}