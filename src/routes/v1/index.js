import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import { userRouter } from './userRoute'

const Router = express.Router()

/** Check api v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are realy to use.', status: StatusCodes.OK })
})
/** Board APIs */
Router.use('/boards', boardRouter)
/** User APIs */
Router.use('/users', userRouter)
export const APIs_V1 =Router