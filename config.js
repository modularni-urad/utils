import { APIError } from './errors'

function getOrgConfig (req) {
  const orgid = MAPPING[req.hostname]
  req.orgconfig = ORG_CONFIGS[orgid]
  return orgid !== undefined
}

export function setup (configs) {
  const mapping = {}
  for (let orgid in configs) {
    configs[orgid].domains.map(d => {
      mapping[d] = orgid
    })
  }
  console.log(`ORGID setup: ${JSON.stringify(mapping)}`)
  MAPPING = mapping
  ORG_CONFIGS = configs
}

// object of {domain: orgid}
let MAPPING = {}
let ORG_CONFIGS = null

export function loadOrgConfig (req, res, next) {
  return getOrgConfig(req) 
    ? next() 
    : next(new APIError(404, 'orgid not set for this domain'))
}
