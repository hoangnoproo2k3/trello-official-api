import express from 'express'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()
Router.route('/')
  .post(columnController.createNewColumnWithBoard)
  .patch(columnController.updateDestroyColumn)
Router.route('/list-columns')
  .post(columnController.getColumns)

export const columnRouter =Router
