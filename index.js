import initDB from './db'
import initErrorHandlers from './error_handlers'
import { APIError } from './errors'
import auth from './auth'
import GetConfigWatcher from './configloader'
import { setup as setupOrgConfig, createLoadOrgConfigMW } from './config'
import { setup as setupCORS, configCallback as CORSconfigCallback } from './cors'

async function initConfigManager (configFolder, configHook = null) {
  const confWatcher = GetConfigWatcher(configFolder)
  return new Promise((resolve, reject) => {
    confWatcher.on('loaded', configs => {
      setupOrgConfig(configs)
      setupCORS(configs)
      configHook 
        ? configHook(configs).then(resolve).catch(reject)
        : resolve()
    })
    confWatcher.on('changed', (orgid, configs) => {
      setupOrgConfig(configs)
      setupCORS(configs)
      configHook && configHook(configs)
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
  setupOrgConfig, createLoadOrgConfigMW,
  initConfigManager
}
