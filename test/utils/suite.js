import fs from 'fs'
import path from 'path'

export async function getFolderSuites (folder) {
  const items = await fs.promises.readdir(folder, { withFileTypes: true })
  const suites = items.filter(i => i.isFile()).sort()
  return suites
}