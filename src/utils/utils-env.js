import { env } from '~/config/environment'
const isProduction = env.BUILD_MODE === 'production'
export const secretOrKey = isProduction ? env.JWT_SECRET_PROD : env.JWT_SECRET_DEV
export const getClientUrl = () => {
  let clientUrl = ''
  if (isProduction) {
    clientUrl = env.CLIENT_URL_PROD
  } else {
    clientUrl = env.CLIENT_URL_DEV
  }
  return clientUrl
}

export const getServerUrl = () => {
  let serverUrl = ''
  if (isProduction) {
    serverUrl = env.SERVER_URL_PROD
  } else {
    serverUrl = env.SERVER_URL_DEV
  }
  return serverUrl
}
