const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
import { env } from '~/config/environment'
import { getServerUrl } from '~/utils/utils'
const SERVER_URL = getServerUrl()
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile)
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
