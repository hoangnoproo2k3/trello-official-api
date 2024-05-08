/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import cors from 'cors'
import express from 'express'
const cookieSession = require('cookie-session')
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
const passportSetup = require('./config/passport')
import { authRoute } from './routes/auth'
import passport from 'passport'
import session from 'express-session'

const START_SERVER = () => {
  const app = express()
  app.use(
    session({
      secret: env.GOOGLE_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(
    cors()
  )
  app.use(express.json())
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
      console.log(`3. Hello ${env.AUTHOR} , I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
    })
  }

  // Cleanup before shutdown server
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}
// then - catch
// CONNECT_DB()
//   .then(() => {
//     console.log('Connect to MongoDB Cloud Atlas!')
//   })
//   .then(() => {START_SERVER()})
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
// async - await (IIFE)
( async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()