import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { cardModel } from './cardModel'

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
const updateDestroyColumn = async (columnId, boardId, _destroy) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(columnId), boardId },
      { $set: { _destroy: _destroy } }
    )
    if (result.matchedCount === 0) {
      throw new Error('Column not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating column columns: ' + error.message)
  }
}
const updateColumnWithCard = async (columnID, newCardId) => {
  try {
    const filter = { _id: new ObjectId(columnID) }
    const updateDoc = { $push: { cardOrderIds: newCardId } }
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(filter, updateDoc)
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
const updateCardsOrderIdsColumn = async (columnId, newCardsOrderIds) => {
  try {
    const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(columnId) },
      { $set: { cardOrderIds: newCardsOrderIds } }
    )
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
const getColumnWithBoards = async (boardId) => {
  try {
    const columns = await GET_DB().collection(COLUMN_COLLECTION_NAME).find({ boardId, _destroy:false }).toArray()
    return columns
  } catch (error) {
    throw new Error('Error getting users: ' + error.message)
  }
}
const getColumnsWithCards = async (boardId) => {
  try {
    const columns = await GET_DB().collection(COLUMN_COLLECTION_NAME).find({ boardId, _destroy:false }).toArray()
    for (const column of columns) {
      const columnId = column._id.toString()
      const cards = await cardModel.getCardsWithColumn(columnId, boardId)
      column.cards = cards
    }
    return columns
  } catch (error) {
    throw new Error('Error getting columns: ' + error.message)
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  checkNameBoardExistence,
  createNewColumn,
  findOneByIdColumn,
  updateDestroyColumn,
  updateColumnWithCard,
  updateCardsOrderIdsColumn,
  getColumnsWithCards,
  getColumnWithBoards
}