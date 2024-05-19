import express from 'express'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()
Router.route('/')
  .post(columnController.createNewColumnWithBoard)
  .patch(columnController.updateDestroyColumn)
Router.route('/list-columns')
  .post(columnController.getColumns)
Router.route('/list-columns-cards')
  .post(columnController.getColumnsWithCards)
export const columnRouter =Router
