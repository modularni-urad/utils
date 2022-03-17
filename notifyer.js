import axios from 'axios'
import logger from './logger'

export function notifyUser (tenant, content, UID, type, data) {
  const payload = { content, UID, type, data }
  const url = process.env.NOTIFYER_SERVICE.replace('{{TENANTID}}', tenant)
  return axios.post(url, payload).catch(err => {
    logger.error(err)
  })
}
