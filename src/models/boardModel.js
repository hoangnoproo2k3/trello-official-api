import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).trim().strict(),
  slug: Joi.string().trim().strict(),
  description: Joi.string().required().min(3).max(300).trim().strict(),
  type:Joi.string().valid('private', 'public').default('public'),
  ownerIds:Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([])
})

const checkNameBoardExistence = async (title) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ title })
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
const getPaginatedDocuments = async (page, pageSize, ownerIds) => {
  let skip = 1
  let limit = 10
  if (page && pageSize) {
    skip = (page - 1) * pageSize
    limit = pageSize
  }
  try {
    const documents = await GET_DB().collection(BOARD_COLLECTION_NAME)
      .find({ ownerIds })
      .skip(skip)
      .limit(limit)
      .toArray()
    return documents
  } catch (error) { throw new Error(error) }
}
const getBoardsCount = async (ownerIds) => {
  try {
    const count = await GET_DB().collection(BOARD_COLLECTION_NAME).countDocuments({
      ownerIds
    })
    return count
  } catch (error) {
    throw new Error('Error getting boards count: ' + error.message)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNewBoard,
  checkNameBoardExistence,
  findOneByIdBoard,
  getPaginatedDocuments,
  getBoardsCount
}