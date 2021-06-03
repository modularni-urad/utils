import path from 'path'
process.env.PORT = 33333
process.env.SESSION_SERVICE = 'http://localhost:5000'
process.env.NODE_ENV = 'test'
process.env.SESSION_COOKIE_NAME = 'Bearer'