import express from 'express'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()
Router.route('/')
  .get(boardController.getPaginatedDocuments)
  .post(boardController.createNewBoard)

export const boardRouter =Router
