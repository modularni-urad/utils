/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(`http://localhost:${process.env.PORT}`)
  const configs = {
    11: { domains: ['pokus.cz'] }
  }
  
  return describe('OrgID', () => {

    g.setupOrgConfigs(configs)

    it('shall succeed with approp orgID', async () => {
      const res = await r.get('/domainsensitive').set('Host', 'pokus.cz')
      res.status.should.equal(200)
      res.body.domains[0].should.equal('pokus.cz')
    })

    it('shall fail with 404', async () => {
      const res = await r.get('/domainsensitive')
      res.status.should.equal(404)
      res.text.should.equal('orgid not set for this domain')
    })

  })
}
