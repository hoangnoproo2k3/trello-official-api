import { StatusCodes } from 'http-status-codes'
import { boardServices } from '~/services/boardService'
const createNew = async (req, res, next) => {
  try {
    const createBoard = await boardServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ message: createBoard, status: StatusCodes.CREATED })
  } catch (error) { next(error) }
}
export const boardController = {
  createNew
}