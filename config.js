import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import chokidar from 'chokidar'
import { EventEmitter } from 'events'

const configs = {}
let loaded = false
let _promises = []

export default function doWatch(CONFIG_FOLDER) {
  // watch folder with yaml config files and emits events on changes.
  const ee = new EventEmitter()

  const watcher = chokidar.watch(CONFIG_FOLDER)
  const r = /(?<orgid>[0-9]*).yaml$/

  async function _load (filepath) {
    const src = await fs.promises.readFile(filepath, 'utf8')
    const config = yaml.parse(src)
    const key = Number(path.basename(filepath).match(r).groups.orgid)
    configs[key] = Object.freeze(config)
    return key
  }
  
  watcher.on('add', (filepath, stats) => {
    const loadPromise = _load(filepath)
    loaded 
      ? loadPromise.then(key => {
          ee.emit('changed', key, configs)
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