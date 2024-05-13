import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { boardServices } from '~/services/boardService'
import { slugify } from '~/utils/formatters'
const createNew = async (req, res, next) => {
  try {
    const createBoard = await boardServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ message: createBoard, status: StatusCodes.CREATED })
  } catch (error) { next(error) }
}
const createNewBoard = async (req, res, next) => {
  try {
    const titleExists = await boardModel.checkNameBoardExistence(req.body.title)
    const newBoard = {
      ...req.body,
      slug: slugify(req.body.title)
    }
    if (titleExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title đã tồn tại', status: StatusCodes.BAD_REQUEST })
    }
    const createdBoard = await boardModel.createNewBoard(newBoard)
    const getNewBoard = await boardModel.findOneByIdBoard(createdBoard.insertedId)
    res.status(StatusCodes.CREATED).json({ message: getNewBoard, status: StatusCodes.CREATED })
  } catch (error) {
    next(error)
  }
}
const getPaginatedDocuments = async (req, res, next) => {
  try {
    const { pageNumber, pageSize } = req.query
    const parsedPageNumber = parseInt(pageNumber)
    const parsedPageSize = parseInt(pageSize)
    if (isNaN(parsedPageNumber) || isNaN(parsedPageSize) || parsedPageNumber <= 0 || parsedPageSize <= 0) {
      return res.status(400).json({ message: 'pageNumber và pageSize phải là số nguyên dương' })
    }
    const documents = await boardModel.getPaginatedDocuments(parsedPageNumber, parsedPageSize)
    res.status(200).json({ documents })
  } catch (error) {
    next(error)
  }
}


export const boardController = {
  createNew,
  createNewBoard,
  getPaginatedDocuments
}