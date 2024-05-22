import { ObjectId } from 'mongodb'

const Joi = require('joi')
const { GET_DB } = require('~/config/mongodb')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('~/utils/validators')

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().min(3).max(50).trim().strict(),
  image: Joi.string().min(3).max(50).trim().strict(),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  comments: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  like: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  attachments: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const checkNameCardExistence = async (title, columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ title, columnId })
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}
const createNewCard =async (data) => {
  try {
    const validate = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
    const createBoard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validate)
    return createBoard
  } catch (error) { throw new Error(error) }
}
const findOneByIdCard = async (id) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const getCardsWithColumn = async (columnId, boardId) => {
  try {
    const cards = await GET_DB().collection(CARD_COLLECTION_NAME).find({ columnId, boardId, _destroy: false }).toArray()
    return cards
  } catch (error) {
    throw new Error('Error getting users: ' + error.message)
  }
}
const updateCardsDndKit = async (cardId, columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(cardId) },
      { $set: { columnId } }
    )
    if (result.matchedCount === 0) {
      throw new Error('Board not found')
    }
    return result.modifiedCount > 0
  } catch (error) {
    throw new Error('Error updating board columns: ' + error.message)
  }
}
export const cardModel = {
  CARD_COLLECTION_SCHEMA,
  CARD_COLLECTION_NAME,
  checkNameCardExistence,
  createNewCard,
  findOneByIdCard,
  getCardsWithColumn,
  updateCardsDndKit
}