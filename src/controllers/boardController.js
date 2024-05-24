import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
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
const createNewBoardWithUser = async (req, res, next) => {
  try {
    const titleExists = await boardModel.checkNameBoardExistence(req.body.title, req.body.ownerId)
    const newBoard = {
      ...req.body,
      slug: slugify(req.body.title)
    }
    if (titleExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title đã tồn tại', status: StatusCodes.BAD_REQUEST })
    }
    const createdBoard = await boardModel.createNewBoard(newBoard)
    const boardId = createdBoard.insertedId
    const getNewBoard = await boardModel.findOneByIdBoard(boardId)
    await userModel.updateUserBoards(req.body.ownerId, boardId)
    res.status(201).json({ message: getNewBoard, boardId })
  } catch (error) {
    next(error)
  }
}
const updateColumnOrderIdsBoard = async( req, res, next) => {
  try {
    await boardModel.updateColumnOrderIdsBoard(req.body.boardId, req.body.columnOrderIds)
    const getBoard = await boardModel.findOneByIdBoard(req.body.boardId)
    res.status(StatusCodes.OK).json({ message: getBoard, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getDetailBoardWithId = async (req, res, next) => {
  try {
    const boardId = req.params.boardId
    const getBoards = await boardModel.findOneByIdBoard(boardId)
    if (!getBoards) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    return res.status(StatusCodes.OK).json({ message: { getBoards: getBoards }, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getPaginatedBoards = async (req, res, next) => {
  try {
    const { pageNumber, pageSize } = req.query
    const ownerId= req.body.ownerId
    const parsedPageNumber = parseInt(pageNumber)
    const parsedPageSize = parseInt(pageSize)
    if (parsedPageNumber <= 0 || parsedPageSize <= 0) {
      return res.status(400).json({ message: 'pageNumber và pageSize phải là số nguyên dương' })
    }
    const getBoards = await boardModel.getPaginatedDocuments(parsedPageNumber, parsedPageSize, ownerId)
    const getBoardsCount = await boardModel.getBoardsCount(ownerId)
    return res.status(StatusCodes.OK).json({ message: { getBoards: getBoards, getBoardsCount: getBoardsCount }, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getLatestDocuments = async (req, res, next) => {
  try {
    const { currentPage } = req.query
    const ownerId= req.body.ownerId
    const parsedPageNumber = parseInt(currentPage)
    if (parsedPageNumber <= 0) {
      return res.status(400).json({ message: 'currentPage phải là số nguyên dương' })
    }
    const getBoards = await boardModel.getLatestDocuments(parsedPageNumber, ownerId)
    return res.status(StatusCodes.OK).json({ message: { getBoards: getBoards }, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getResultSearchTitle = async (req, res, next) => {
  try {
    const searchTerm = req.query.q
    const ownerId= req.body.ownerId
    const listBoards = await boardModel.getSearchTitleBoards(searchTerm, ownerId)
    return res.status(StatusCodes.OK).json({ getBoards: listBoards, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNewBoard,
  createNewBoardWithUser,
  updateColumnOrderIdsBoard,
  getDetailBoardWithId,
  getPaginatedBoards,
  getLatestDocuments,
  getResultSearchTitle
}