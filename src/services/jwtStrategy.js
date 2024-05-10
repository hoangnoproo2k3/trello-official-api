import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { userModel } from '~/models/userModel'
import { secretOrKey } from '~/utils/utils-env'

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
    secretOrKey
  },
  async (payload, done) => {
    try {
      const user = await userModel.findOneByIdUser(payload.id)
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (err) {
      done(err, false)
    }
  }
)

passport.use(jwtLogin)

export const requireJwtAuth = passport.authenticate('jwt', { session: false })