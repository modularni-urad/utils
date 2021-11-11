
// special class for operational errors
// every other errors are handled as programmer errors
export class APIError extends Error {
  constructor (code, message) {
    super()
    Error.captureStackTrace( this, this.constructor )
    this.name = code
    this.message = message
  }
}