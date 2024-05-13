import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()
Router.route('/')
  .get(userController.getListUsers)
  .post(userController.createNewUserWithGoogle)

export const userRouter =Router
