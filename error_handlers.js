import { APIError } from './errors'
import { errors } from 'celebrate'

export default function initErrorHandlers (app, callback500 = null) {

  app.use((error, req, res, next) => {
    if (error instanceof APIError) {
      return res.status(error.name).send(error.message)
    }
    if (error.data || error.table) {
      return res.status(400).send(error.message)
    }
    next(error)
  })

  process.env.NODE_ENV === 'test' && app.use((error, req, res, next) => {
    if (error.code && error.code.indexOf('SQLITE_CONSTRAINT') === 0) {
      return res.status(400).send(error.message)
    }
    next(error)
  })

  app.use(errors()) // validation errors handling

  app.use((error, req, res, next) => {
    process.env.LOG_500_ERRORS && console.error(error)
    callback500 && callback500(error)
    res.status(500).send(error.message || error.toString())
  })

}