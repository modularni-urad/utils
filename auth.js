import axios from 'axios'
import assert from 'assert'
const session = require('express-session')
const redis = require('redis')

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

export function initAuth (app) {
  if (process.env.MOCKUSER) {
    // this is only for development purposes
    app.use((req, res, next) => {
      req.session = { user: JSON.parse(process.env.MOCKUSER) }
      next()
    })
  } else {
    // normal express session based auth
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          httpOnly: process.env.NODE_ENV === 'production'
        }
      })
    )
  }
  return { getUID, required, isMember, requireMembership }
}

function isMember (req, gid) {
  try {
    return req.session.user.groups.indexOf(gid) >= 0
  } catch (_) {
    return false
  }
}

const requireMembership = (gid) => (req, res, next) => {
  const amIMember = isMember(req, gid)
  return amIMember ? next() : next(401)
}

function getUID (req) {
  return req.session.user.id
}

export function required (req, res, next) {
  return req.session.user ? next() : next(401)
}

export function inform (UID, message) {
  assert.ok(process.env.AUTH_API, 'env.AUTH_API not defined!')
  return axios.post(`${process.env.AUTH_API}/inform`, { UID, message })
    .catch(err => console.error(err))
}
