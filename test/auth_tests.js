/* global describe it */
import fs from 'fs'
import path from 'path'
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(`http://localhost:${process.env.PORT}`)
  
  return describe('auth', () => {

    it('shall fail with 401', async () => {
      const res = await r.get('/require')
      res.status.should.equal(401)
    })

    it('shall return logged user', async () => {
      // const logRes = await r.post('/auth/login')
      // logRes.status.should.equal(200)
      g.mockUser = { id: 1, name: 'gandalf' }
      const res = await r.get('/require')
        .set('Cookie', `${process.env.SESSION_COOKIE_NAME}=cookieValue`)
      res.status.should.equal(200)
      res.body.name.should.equal(g.mockUser.name)
    })

    it('shall fail with user without reqired group', async () => {
      g.mockUser = { id: 1, name: 'gandalf', groups: ['users'] }
      const res = await r.get('/requireMembership')
        .set('Cookie', `${process.env.SESSION_COOKIE_NAME}=cookieValue`)
      res.status.should.equal(401)
    })

    it('shall return logged user with reqired group', async () => {
      g.mockUser = { id: 1, name: 'gandalf', groups: ['admins'] }
      const res = await r.get('/requireMembership')
        .set('Cookie', `${process.env.SESSION_COOKIE_NAME}=cookieValue`)
      res.status.should.equal(200)
      res.body.name.should.equal(g.mockUser.name)
    })

  })
}
