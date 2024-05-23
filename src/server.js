/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import { corsOptions } from './config/cors'
import { setupUpload } from './config/upload'

const START_SERVER = () => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors(corsOptions))
  app.use(express.json())

  app.use('/v1', APIs_V1)
  setupUpload(app)
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
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    process.exit(0)
  }
})()