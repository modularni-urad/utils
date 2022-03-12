import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

export default function doWatch(CONFIG_FOLDER, callback) {

  const watcher = chokidar.watch(`${CONFIG_FOLDER}/**/*.yaml`, {
    ignoreInitial: true
  })
  const r = /\/(?<orgid>[0-9a-z_]*)\/(.*).yaml$/
  
  watcher.on('add', (filepath, stats) => {
    const f = filepath.substring(CONFIG_FOLDER.length)
    const key = f.match(r).groups.orgid
    callback(key)
  })

  watcher.on('change', (filepath, stats) => {
    const f = filepath.substring(CONFIG_FOLDER.length)
    const key = f.match(r).groups.orgid
    callback(key)
  })

  watcher.on('error', error => {
    console.error(`Watcher error: ${error}`)
  })
}