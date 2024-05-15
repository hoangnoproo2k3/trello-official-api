import express from 'express'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .post(boardController.createNewBoardWithUser)
Router.route('/:boardId')
  .get(boardController.getDetailBoardWithId)
Router.route('/search')
  .post(boardController.getResultSearchTitle)
Router.route('/list-board')
  .post(boardController.getPaginatedBoards)
export const boardRouter =Router
