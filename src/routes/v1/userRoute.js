import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'


const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: API get list user', status: StatusCodes.OK })
  })
  .post(userController.createNew)
Router.route('/:id')
  .get(userController.getDetail)
  .put()
export const userRouter =Router
