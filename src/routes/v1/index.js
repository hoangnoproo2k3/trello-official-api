import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import { userRouter } from './userRoute'
import { columnRouter } from './columnRoute'
import { cardRouter } from './cardRoute'

const Router = express.Router()

/** Check api v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are realy to use.', status: StatusCodes.OK })
})

/** User APIs */
Router.use('/users', userRouter)
/** Board APIs */
Router.use('/boards', boardRouter)
/** Column APIs */
Router.use('/columns', columnRouter)
/** Card APIs */
Router.use('/cards', cardRouter)
export const APIs_V1 =Router