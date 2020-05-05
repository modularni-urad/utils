const session = require('express-session')
const redis = require('redis')

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

export function initAuth (app) {
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
