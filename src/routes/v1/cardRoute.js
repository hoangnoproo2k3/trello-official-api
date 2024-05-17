import express from 'express'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()
Router.route('/')
  .post(cardController.createNewColumnWithBoard)
Router.route('/list-cards')
  .post(cardController.getCards)

export const cardRouter =Router
