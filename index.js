import initDB from './db'
import initErrorHandlers from './error_handlers'
import { APIError } from './errors'
import auth from './auth'
import GetConfigWatcher from './configloader'
import { setup as setupOrgID, createloadOrgConfig } from './config'
import { setup as setupCORS, configCallback as CORSconfigCallback } from './cors'

async function initConfigManager (configFolder) {
  const confWatcher = GetConfigWatcher(configFolder)
  return new Promise((resolve, reject) => {
    confWatcher.on('loaded', configs => {
      setupOrgID(configs)
      setupCORS(configs)
      resolve()
    })
    confWatcher.on('changed', (orgid, configs) => {
      setupOrgID(configs)
      setupCORS(configs)
    })
  })
}

export {
  auth,
  initDB,
  initErrorHandlers,
  APIError,
  GetConfigWatcher,
  setupCORS, CORSconfigCallback,
  setupOrgID, createloadOrgConfig,
  initConfigManager
}
