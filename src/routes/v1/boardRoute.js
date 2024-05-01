import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/boardController'
import { boardValidate } from '~/validations/boardValidation'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Note: API get list board', status: StatusCodes.OK })
  })
  .post(boardValidate.createNew, boardController.createNew)
export const boardRouter =Router
