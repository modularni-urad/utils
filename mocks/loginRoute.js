import axios from 'axios'
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'Bearer'

export default function (user = { id: 42 }) {
  return async (req, res, next) => {
    try {
      const tokenReq = await axios.post(`${process.env.SESSION_SERVICE}/sign`, user)
      const token = tokenReq.data.token
      res.cookie(COOKIE_NAME, token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
        maxAge: 12 * 60 * 60 * 1000 // 12h
      })
      res.json(user)
    } catch (err) {
      next(err)
    }
  }
}