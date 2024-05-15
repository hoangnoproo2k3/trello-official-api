import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const checkNameBoardExistence = async (title, boardId) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ title, boardId })
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}
const createNewColumn =async (data) => {
  try {
    const validate = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
    const createBoard = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validate)
    return createBoard
  } catch (error) { throw new Error(error) }
}
const findOneByIdColumn = async (id) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const getColumnWithBoards = async (boardId) => {
  try {
    const boards = await GET_DB().collection(COLUMN_COLLECTION_NAME).find({ boardId }).toArray()
    return boards
  } catch (error) {
    throw new Error('Error getting users: ' + error.message)
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  checkNameBoardExistence,
  createNewColumn,
  findOneByIdColumn,
  getColumnWithBoards
}