import { env } from '~/config/environment'

export const getClientUrl = () => {
  let clientUrl = ''
  if (env.BUILD_MODE === 'production') {
    clientUrl = env.CLIENT_URL_PROD
  } else {
    clientUrl = env.CLIENT_URL_DEV
  }
  return clientUrl
}

