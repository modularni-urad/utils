import axios from 'axios'
import assert from 'assert'
import { APIError } from './errors'

const SESSION_SVC = process.env.SESSION_SERVICE || 'http://session-svc'
const headerRegex = /^Bearer (.*)/i
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'Bearer'
const cookieRegex = new RegExp(`${COOKIE_NAME}=([^;]*)`,'g')

function _getCookie (req) {
  const match = (req.headers.cookie || '').match(cookieRegex)
  return match ? match[0].substring(COOKIE_NAME.length + 1) : null
}
function _getAuthHeader (req) {
  const match = (req.header('Authorization') || '').match(headerRegex)
  return match ? match[1] : null
}

export function isMember (req, gid) {
  try {
    return req.user.groups.indexOf(gid) >= 0
  } catch (_) {
    return false
  }
}

export const requireMembership = (gid) => (req, res, next) => {
  const amIMember = isMember(req, gid)
  return amIMember ? next() : next(new APIError(403, 'insufficient priviledges'))
}

export function getUID (req) {
  return req.user ? req.user.id : null
}

function session (req, res, next) {
  if (req.user) return next()

  function validateJWT (token) {
    axios.post(`${SESSION_SVC}/verify`, { token }).then(r => {
      req.user = r.data
      next()
    }).catch(err => {
      // console.error(err)
      next()
    })
  }
  const token = _getAuthHeader(req) || _getCookie(req)
  return token ? validateJWT(token) : next()
}

export function required (req, res, next) {
  return req.user ? next() : next(new APIError(401, 'login required'))
}

export function inform (UID, message) {
  assert.ok(process.env.AUTH_API, 'env.AUTH_API not defined!')
  return axios.post(`${process.env.AUTH_API}/inform`, { UID, message })
    .catch(err => console.error(err))
}

export default { isMember, requireMembership, getUID, required, session }