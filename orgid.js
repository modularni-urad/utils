import { APIError } from './errors'

function getOrgID (req) {
  req.orgid = MAPPING[req.hostname]
  return req.orgid !== undefined
}

export function setup (configs) {
  const mapping = {}
  for (let orgid in configs) {
    configs[orgid].domains.map(d => {
      mapping[d] = orgid
    })
  }
  MAPPING = mapping
}

// object of {domain: orgid}
let MAPPING = {}

export function loadOrgID (req, res, next) {
  return getOrgID(req) 
    ? next() 
    : next(new APIError(404, 'orgid not set for this domain'))
}
