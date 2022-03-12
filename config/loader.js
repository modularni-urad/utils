import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import createWatcher from './watcher'

export default async function initConfig(CONFIG_FOLDER, callback) {
  if (! fs.existsSync(CONFIG_FOLDER)) {
    throw new Error(`config folder (${CONFIG_FOLDER}) not exists!`)
  }

  // watch folder with yaml config files and emits events on changes.
  createWatcher(CONFIG_FOLDER, async tenantid => {
    const c = await _loadTenant(tenantid)
    callback(tenantid, c)
  })

  const tenants = await fs.promises.readdir(CONFIG_FOLDER)
  return Promise.all(tenants.map(i => {
    return _loadTenant(i)
  }))

  async function _load (filepath) {
    const src = await fs.promises.readFile(filepath, 'utf8')
    try {
      const config = yaml.parse(src)
      const key = path.basename(filepath).match(r).groups.orgid
      config.orgid = key
      configs[key] = Object.freeze(config)
      return key
    } catch (err) {
      console.error(`--- CONFFILE ${filepath} error -------`)
      if (err instanceof TypeError) {
        console.error(`filename needs to match /^(?<orgid>[0-9a-z_]*).yaml$/`)
      } else {
        console.error(err)
      }
    }
  }
  async function _loadTenant (tenantid) {
    const tenantPath = path.join(CONFIG_FOLDER, tenantid)
    const confs = await fs.promises.readdir(tenantPath)
    const loaded = await Promise.all(confs.sort().map(async i => {
      const src = await fs.promises.readFile(path.join(tenantPath, i), 'utf8')
      return yaml.parse(src)
    }))
    return loaded.reduce((acc, i) => {
      return Object.assign(acc, i)
    }, { orgid: tenantid })
  }  
}