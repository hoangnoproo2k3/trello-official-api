import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'
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
    const titleExists = await boardModel.checkNameBoardExistence(req.body.title)
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
    await userModel.updateUserBoards(req.body.ownerIds, boardId)
    res.status(201).json({ message: getNewBoard, boardId })
  } catch (error) {
    next(error)
  }
}
const getPaginatedDocuments = async (req, res, next) => {
  try {
    const { pageNumber, pageSize } = req.query
    const ownerIds= req.body.ownerIds
    const parsedPageNumber = parseInt(pageNumber)
    const parsedPageSize = parseInt(pageSize)
    if (parsedPageNumber <= 0 || parsedPageSize <= 0) {
      return res.status(400).json({ message: 'pageNumber và pageSize phải là số nguyên dương' })
    }
    const getBoards = await boardModel.getPaginatedDocuments(parsedPageNumber, parsedPageSize, ownerIds)
    const getBoardsCount = await boardModel.getBoardsCount(ownerIds)
    return res.status(StatusCodes.OK).json({ message: { getUsers: getBoards, getUsersCount: getBoardsCount }, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNewBoard,
  createNewBoardWithUser,
  getPaginatedDocuments
}