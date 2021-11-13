import { APIError } from './errors'

function getOrgID (req) {
  req.orgid = MAPPING[req.hostname]
  req.config = ORG_CONFIGS[req.orgid]
  return req.orgid !== undefined
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

export function loadOrgID (req, res, next) {
  return getOrgID(req) 
    ? next() 
    : next(new APIError(404, 'orgid not set for this domain'))
}
