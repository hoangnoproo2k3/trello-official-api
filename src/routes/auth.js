const router = express.Router()
import express from 'express'
import { generateJWT } from '~/services/jwtServices'
import { requireJwtAuth } from '~/services/jwtStrategy'
import { getClientUrl } from '~/utils/utils-env'

const passport = require('passport')
const CLIENT_URL = getClientUrl()
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google',
    { failureRedirect: '/login-fail', session: false }),
  (req, res) => {
    const token = generateJWT(req.user)
    // Lưu cookie trên thiết bị đăng nhập
    res.cookie('x-auth-cookie', token)
    res.redirect(CLIENT_URL)
  })


router.get('/protected', requireJwtAuth, (req, res) => {
  if (req.user) {
    res.json({ message: 'Xác thực thành công', user: req.user })
  } else {
    res.status(401).json({ message: 'Xác thực thất bại' })
  }
})

export const authRoute =router
