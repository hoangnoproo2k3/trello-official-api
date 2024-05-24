import express from 'express'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()
Router.route('/')
  .post(cardController.createNewCardWithBoard)
Router.route('/update-dnd')
  .patch(cardController.updateCardWithDndKit)
Router.route('/:cardId')
  .get(cardController.getDetailCardWithId)
  .put(cardController.updateCard)
Router.route('/list-cards')
  .post(cardController.getCards)

export const cardRouter =Router
