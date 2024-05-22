import express from 'express'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()
Router.route('/')
  .post(cardController.createNewColumnWithBoard)
Router.route('/update-dnd')
  .patch(cardController.updateCardWithDndKit)
Router.route('/:cardId')
  .get(cardController.getDetailCardWithId)
Router.route('/list-cards')
  .post(cardController.getCards)

export const cardRouter =Router
