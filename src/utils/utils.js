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

export const getServerUrl = () => {
  let serverUrl = ''
  if (env.BUILD_MODE === 'production') {
    serverUrl = env.SERVER_URL_PROD
  } else {
    serverUrl = env.SERVER_URL_DEV
  }
  return serverUrl
}
