import express from 'express'
import bodyParser from 'body-parser'

export default function (port, g) {
  const app = express()

  app.post('/sign', bodyParser.json(), (req, res) => {
    g.sessionBasket.push([req.body, req.hostname])
    res.json({ token: 'beeep' })
  })

  app.post('/verify', bodyParser.json(), (req, res) => {
    g.sessionBasket.push([req.body, req.hostname])
    res.json(g.mockUser)
  })

  return app.listen(port)
}