import axios from 'axios'
import logger from './logger'

const NOTIFYER_SERVICE = process.env.NOTIFYER_SERVICE || ''

export function notifyUser (tenant, content, UID, type, data) {
  const payload = { content, UID, type, data }
  const url = NOTIFYER_SERVICE.replace('{{TENANTID}}', tenant)
  return axios.post(url, payload).catch(err => {
    logger.error(err)
  })
}
