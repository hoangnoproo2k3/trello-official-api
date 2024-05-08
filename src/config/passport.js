const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
import { env } from '~/config/environment'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback'
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
