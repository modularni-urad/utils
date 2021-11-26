
export function setup (configs) {
  CONFIGS = configs
}

let CONFIGS = []

// taken from https://github.com/expressjs/cors#configuring-cors-asynchronously
export function configCallback (req, callback) {
  const ALLOWED = CONFIGS[req.params.tenantid]
  const origin = (ALLOWED && ALLOWED.cors !== undefined) ? ALLOWED.cors : false
  // callback expects two parameters: error and options
  callback(null, { origin })
}