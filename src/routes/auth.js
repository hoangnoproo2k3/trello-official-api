const router = express.Router()
import express from 'express'
import { generateJWT } from '~/services/jwtServices'
import { requireJwtAuth } from '~/services/jwtStrategy'
import { getClientUrl } from '~/utils/utils-env'

const passport = require('passport')
const CLIENT_URL = getClientUrl()
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Sửa đổi router.get('/google/callback', ...)
router.get('/google/callback', passport.authenticate('google',
  { failureRedirect: '/login-fail', session: false }),
(req, res) => {
  const user = req.user
  const token = generateJWT(user)
  res.json({ token, user })
})

// Sửa đổi router.get('/logout', ...)
router.get('/logout', (req, res) => {
  // Không cần xóa cookie, chỉ cần phản hồi thành công
  res.status(200).json({ message: 'Đăng xuất thành công' })
})
// router.get('/google/callback',
//   passport.authenticate('google',
//     { failureRedirect: '/login-fail', session: false }),
//   (req, res) => {
//     const token = generateJWT(req.user)
//     // Lưu cookie trên thiết bị đăng nhập
//     res.cookie('x-auth-cookie', token)
//     res.cookie('gg_id', req.user.id)
//     res.redirect(CLIENT_URL)
//   })

// router.get('/logout', (req, res) => {
//   res.clearCookie('x-auth-cookie')
//   res.clearCookie('gg_id')
//   res.redirect(`${CLIENT_URL}`)
// })
router.get('/protected', requireJwtAuth, (req, res) => {
  if (req.user) {
    res.json({ message: 'Xác thực thành công', user: req.user })
  } else {
    res.status(401).json({ message: 'Xác thực thất bại' })
  }
})

export const authRoute =router
