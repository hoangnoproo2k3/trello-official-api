const { StatusCodes } = require('http-status-codes')
const { boardModel } = require('~/models/boardModel')
const { columnModel } = require('~/models/columnModel')

const createNewColumnWithBoard = async (req, res, next) => {
  try {
    const titleExists = await columnModel.checkNameBoardExistence(req.body.title, req.body.boardId)
    if (titleExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title column đã tồn tại', status: StatusCodes.BAD_REQUEST })
    }
    const createdColumn = await columnModel.createNewColumn(req.body)
    const columnId = createdColumn.insertedId
    const getNewColumn = await columnModel.findOneByIdColumn(columnId)
    await boardModel.updateBoardWithColumn(req.body.boardId, columnId)
    res.status(201).json({ message: getNewColumn, columnId })
  } catch (error) {
    next(error)
  }
}
const updateDestroyColumn = async( req, res, next) => {
  try {
    await columnModel.updateDestroyColumn(req.body.columnId, req.body.boardId, req.body.destroy)
    const getColumn = await columnModel.findOneByIdColumn(req.body.columnId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getColumns = async (req, res, next) => {
  try {
    const getColumns = await columnModel.getColumnWithBoards(req.body.boardId)
    return res.status(StatusCodes.OK).json({ getColumns: getColumns, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
export const columnController = {
  createNewColumnWithBoard,
  updateDestroyColumn,
  getColumns
}