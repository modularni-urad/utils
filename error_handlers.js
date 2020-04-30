export default function initErrorHandlers (app) {
  app.use(notFoundErrorHlr, authErrorHlr, generalErrorHlr)
}

function generalErrorHlr (err, req, res, next) {
  const status = err.status ||
    isNaN(Number(err.message)) ? 400 : Number(err.message)
  res.status(status).send(err.message || err)
  if (process.env.NODE_ENV !== 'production') {
    console.log('---------------------------------------------------------')
    console.log(err)
    console.log('---------------------------------------------------------')
  }
}
function authErrorHlr (err, req, res, next) {
  if (err.name === 'JsonWebTokenError' || err.status === 401) {
    return res.status(401).send(err.message)
  }
  next(err)
}
function notFoundErrorHlr (err, req, res, next) {
  if (err.statusCode === 404) {
    return res.status(404).send(err.data)
  }
  next(err)
}
