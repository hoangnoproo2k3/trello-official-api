const router = express.Router()
import express from 'express'
import { userController } from '~/controllers/userController'
import { getClientUrl } from '~/utils/utils'
const passport = require('passport')
const CLIENT_URL = getClientUrl()
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user
      //   cookies: req.cookies
    })
  }
})

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure'
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(CLIENT_URL)
})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), userController.createNewUserGoogle)

export const authRoute =router
