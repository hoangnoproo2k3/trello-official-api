import express from 'express'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()
Router.route('/')
  .post(cardController.createNewCardWithBoard)
Router.route('/update-dnd')
  .patch(cardController.updateCardWithDndKit)
Router.route('/update-like')
  .patch(cardController.updateCardWithUserLike)
Router.route('/update-unlike')
  .patch(cardController.updateCardWithUserUnlike)
Router.route('/update-comment/:cardId')
  .post(cardController.updateCardWithUserComment)
  // .post(cardController.deleteCommentInCard)
Router.route('/delete-comment/:cardId')
  .post(cardController.deleteCommentInCard)
Router.route('/:cardId')
  .get(cardController.getDetailCardWithId)
  .put(cardController.updateCard)
Router.route('/list-cards')
  .post(cardController.getCards)

export const cardRouter =Router
