import express from 'express'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .post(boardController.createNewBoardWithUser)
Router.route('/list-board')
  .post(boardController.getPaginatedDocuments)
export const boardRouter =Router
