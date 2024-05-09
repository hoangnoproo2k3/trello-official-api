const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { getServerUrl } from '~/utils/utils'
const SERVER_URL = getServerUrl()
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          googleId: profile.id,
          name:profile?._json?.name,
          email: profile?._json?.email,
          avatar: profile?._json?.picture,
          accessToken: accessToken,
          ...userData
        }
        const emailExists = await userModel.checkEmailExistence(userData.email)
        if (!emailExists) {
          await userModel.createNew(userData)
        }
        done(null, profile)
      } catch (error) {
        done(error)
      }
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
