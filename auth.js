import axios from 'axios'
import assert from 'assert'

const SESSION_SVC = process.env.SESSION_SERVICE || 'session-svc'
const headerRegex = /^Bearer (.*)/i
const COOKIE_NAME = 'Bearer'

function _getCookie (req) {
  return req.cookies ? req.cookies[COOKIE_NAME] : req.signedCookies
    ? req.signedCookies[COOKIE_NAME] : null
}
function _getAuthHeader (req) {
  const match = (req.header('Authorization') || '').match(headerRegex)
  return match ? match[1] : null
}

export default function initAuth (app) {
  // if present delegate JWT parsing to SESSION_SERVICE endpoint
  app.use((req, res, next) => {
    function validateJWT (token) {
      axios.get(`${SESSION_SVC}/verify/${token}`).then(r => {
        req.session.user = r.data
        next()
      }).catch(next)
    }
    const token = _getAuthHeader(req) || _getCookie(req)
    return token
      ? validateJWT(token)
      : next() // continue immediately
  })
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
