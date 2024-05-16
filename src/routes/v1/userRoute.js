import express from 'express'
import { userController } from '~/controllers/userController'

const Router = express.Router()
Router.route('/')
  .get(userController.getListUsers)
  .post(userController.createNewUserWithGoogle)
Router.route('/email')
  .post(userController.getDetailUserWithEmail)
Router.route('/search')
  .post(userController.getResultSearchUser)
export const userRouter =Router
