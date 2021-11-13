
export function setup (configs) {
  const allowed = []
  for (let orgid in configs) {
    configs[orgid].cors.map(d => {
      allowed.push(d)
    })
  }
  console.log(`CORS setup: ${JSON.stringify(allowed)}`)
  ALLOWED = allowed
}

let ALLOWED = []    // array of allowed origins

// taken from https://github.com/expressjs/cors#configuring-cors-asynchronously
export function configCallback (req, callback) {
  const found = ALLOWED.indexOf(req.header('Origin')) !== -1
  // callback expects two parameters: error and options
  callback(null, { origin: found })
}