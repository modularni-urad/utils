const express = require('express')

module.exports = function (port, userProvider = null) {
  const app = express()
  const mockPort = process.env.SESSION_MOCK
  userProvider = userProvider || defaultUserProvider 

  app.get('*', (req, res) => {
    return res.json(userProvider(req))
  })

  app.listen(mockPort, (err) => {
    if (err) throw err
    console.log(`mockauth listens on ${mockPort}`)
  })
}

function defaultUserProvider (req) { 
  return { id: 42 } 
}