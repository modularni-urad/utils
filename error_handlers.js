import { APIError } from './errors'

export default function initErrorHandlers (app) {
  app.use(generalErrorHlr)
}

function generalErrorHlr (error, req, res, next) {
  if (error instanceof APIError) {
    return res.status(error.name).send(error.message)
  }
  process.env.LOG_500_ERRORS && console.error(error)
  res.status(500).send(error.message || error.toString())
}
