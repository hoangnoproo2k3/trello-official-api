// authUtils.js (hoặc userUtils.js)
import jwt from 'jsonwebtoken'
import { isProduction } from '../utils/utils-env'

// Định nghĩa phương thức generateJWT
export const generateJWT = (user) => {
  const payload = {
    id: user.id,
    displayName: user.displayName,
    email: user?.value?.email,
    provider: user.provider
  }

  const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV
  const token = jwt.sign(payload, secretOrKey, { expiresIn: '12h' })
  return token
}

