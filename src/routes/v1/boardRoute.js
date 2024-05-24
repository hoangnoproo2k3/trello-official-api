import express from 'express'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .post(boardController.createNewBoardWithUser)
  .patch(boardController.updateColumnOrderIdsBoard)
Router.route('/:boardId')
  .get(boardController.getDetailBoardWithId)
Router.route('/search')
  .post(boardController.getResultSearchTitle)
Router.route('/list-board')
  .post(boardController.getPaginatedBoards)
Router.route('/list-board-public')
  .post(boardController.getLatestDocuments)
export const boardRouter =Router
