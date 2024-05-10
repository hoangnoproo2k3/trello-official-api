/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import { authRoute } from './routes/auth'

const START_SERVER = () => {
  const app = express()
  // Bodyparser Middleware
  app.use(express.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(
    cors(corsOptions)
  )
  app.use(passport.initialize())
  require('./services/jwtStrategy')
  require('./services/googleStrategy')
  // app.use(passport.session())

  // login with gg
  app.use('/auth', authRoute)
  app.use('/v1', APIs_V1)
  // Middleware handle error
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE==='production') {
    app.listen(process.env.PORT, () => {
      console.log(`Production ${env.AUTHOR} , I am running at Port : ${process.env.PORT}`)
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Hello ${env.AUTHOR} , I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
    })
  }

  // Cleanup before shutdown server
  exitHook(() => {
    CLOSE_DB()
  })
}

( async () => {
  try {
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()