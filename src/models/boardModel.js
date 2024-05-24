import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).trim().strict(),
  slug: Joi.string().trim().strict(),
  description: Joi.string().min(3).max(300).trim().strict(),
  type:Joi.string().valid('private', 'public').default('public'),
  bgColor: Joi.string().trim().strict(),
  ownerId:Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const checkNameBoardExistence = async (title, ownerId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ title, ownerId })
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}
const createNewBoard =async (data) => {
  try {
    const validate = await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validate)
    return createBoard
  } catch (error) { throw new Error(error) }
}
const findOneByIdBoard = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const updateBoardWithColumn = async (boardID, newColumnId) => {
  try {
    const filter = { _id: new ObjectId(boardID) }
    const updateDoc = { $push: { columnOrderIds: newColumnId } }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).updateOne(filter, updateDoc)
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
const updateBoardWithUserMembers= async (boardID, newMember) => {
  try {
    const filter = { _id: new ObjectId(boardID) }
    const updateDoc = { $addToSet: { memberIds: newMember } }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).updateOne(filter, updateDoc)
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
const updateColumnOrderIdsBoard = async (boardId, newColumnOrderIds) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(boardId) },
      { $set: { columnOrderIds: newColumnOrderIds } }
    )
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
const getPaginatedDocuments = async (page, pageSize, ownerId) => {
  let skip = 0
  let limit = 10
  if (page && pageSize) {
    skip = (page - 1) * pageSize
    limit = pageSize
  }
  try {
    const query = {
      $or: [
        { ownerId },
        { memberIds: ownerId }
      ]
    }
    const documents = await GET_DB().collection(BOARD_COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    return documents
  } catch (error) { throw new Error(error) }
}
const getLatestDocuments = async (currentPage, userId) => {
  const limit = 8
  try {
    let query = { type: 'public' }
    if (userId) {
      query.$and = [
        { ownerId: { $ne: userId } },
        { memberIds: { $nin: [userId] } }
      ]
    }
    const skip = (currentPage - 1) * limit
    const documents = await GET_DB().collection(BOARD_COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    return documents
  } catch (error) {
    throw new Error(error)
  }
}
const getBoardsCount = async (ownerId) => {
  try {
    const count = await GET_DB().collection(BOARD_COLLECTION_NAME).countDocuments({
      ownerId
    })
    return count
  } catch (error) {
    throw new Error('Error getting boards count: ' + error.message)
  }
}
const getSearchTitleBoards = async (searchTitle, ownerId) => {
  const filter = {
    title: { $regex: searchTitle, $options: 'i' },
    ownerId:ownerId
  }
  const projection = { _id: 1, title: 1, slug: 1 }
  const boards = await GET_DB().collection(BOARD_COLLECTION_NAME).find(filter).project(projection).toArray()
  return boards
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNewBoard,
  checkNameBoardExistence,
  findOneByIdBoard,
  updateBoardWithColumn,
  updateBoardWithUserMembers,
  updateColumnOrderIdsBoard,
  getPaginatedDocuments,
  getLatestDocuments,
  getSearchTitleBoards,
  getBoardsCount
}