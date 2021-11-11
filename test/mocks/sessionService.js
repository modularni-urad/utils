import express from 'express'

export default function (port, g) {
  const app = express()

  app.post('/sign', express.json(), (req, res) => {
    g.sessionBasket.push([req.body, req.hostname])
    res.json({ token: 'beeep' })
  })

  app.post('/verify', express.json(), (req, res) => {
    g.sessionBasket.push([req.body, req.hostname])
    res.json(g.mockUser)
  })

  app.post('/set', express.json(), (req, res) => {
    Object.assign(g.mockUser, req.body)
    res.json({ message: 'ok' })
  })

  return app.listen(port)
}