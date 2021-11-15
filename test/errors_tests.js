/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  //
  const r = chai.request(`http://localhost:${process.env.PORT}`)
  
  return describe('errors', () => {

    it('shall fail with 401', async () => {
      const res = await r.get('/require')
      res.status.should.equal(401)
      res.text.should.equal('login required')
    })

    it('shall fail with 500', async () => {
      const res = await r.get('/error')
      res.status.should.equal(500)
      res.text.should.be.ok
    })

  })
}
