import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).trim().strict(),
  slug: Joi.string().trim().strict(),
  description: Joi.string().required().min(3).max(300).trim().strict(),
  type:Joi.string().valid('private', 'public').default('public'),
  ownerIds:Joi.array().items(Joi.string()),
  memberIds:Joi.array().items(Joi.string()),
  columnOrderIds: Joi.array().items(Joi.string())
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
    // Validate ở đây giúp tránh sai sót dữ liệu và cập nhật đầy đủ các trường
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
const getPaginatedDocuments = async (pageNumber, pageSize) => {
  try {
    const skipAmount = (pageNumber - 1) * pageSize
    const documents = await GET_DB().collection(BOARD_COLLECTION_NAME).find({}).skip(skipAmount).limit(pageSize).toArray()
    return documents
  } catch (error) { throw new Error(error) }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNewBoard,
  checkNameBoardExistence,
  findOneByIdBoard,
  getPaginatedDocuments
}