import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import chokidar from 'chokidar'
import { EventEmitter } from 'events'

const configs = {}
let loaded = false
let _promises = []

export default function doWatch(CONFIG_FOLDER) {
  if (! fs.existsSync(CONFIG_FOLDER)) {
    throw new Error(`config folder (${CONFIG_FOLDER}) not exists!`)
  }
  // watch folder with yaml config files and emits events on changes.
  const ee = new EventEmitter()

  const watcher = chokidar.watch(CONFIG_FOLDER)
  const r = /^(?<orgid>[0-9a-z_]*).yaml$/

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
  
  watcher.on('add', (filepath, stats) => {
    const loadPromise = _load(filepath)
    loaded 
      ? loadPromise.then(key => {
          key && ee.emit('changed', key, configs)
        })
      : _promises.push(loadPromise)
  })

  watcher.on('ready', (filepath, stats) => {
    Promise.all(_promises).then(keys => {
      ee.emit('loaded', configs)
      loaded = true
      _promises = null
    })
  })

  watcher.on('change', async (filepath, stats) => {
    const key = await _load(filepath)
    ee.emit('changed', key, configs)
  })

  watcher.on('error', error => {
    console.error(`Watcher error: ${error}`)
  })

  return ee
}