import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().email().required().min(3).trim().strict(),
  password: Joi.string().trim().strict(),
  avatar: Joi.string().uri().trim().strict(),
  permissions: Joi.array().items(Joi.string().valid('admin', 'member', 'guest')).default(['member']),
  boards: Joi.array().items(Joi.string()),
  accountStatus: Joi.string().valid('active', 'suspended', 'locked').default('active'),
  creationDate: Joi.date().default(Date.now),
  lastUpdateDate: Joi.date().default(Date.now)
  // cards: Joi.array().items(Joi.string()),
  // authToken: Joi.string(),
  // groups: Joi.array().items(Joi.string()),
  // notificationCards: Joi.array().items(Joi.string()),
  // recentActivities: Joi.array().items(Joi.string()),
  // userSettings: Joi.object({
  //   language: Joi.string().default('en'),
  //   timeZone: Joi.string().default('UTC'),
  //   notificationSettings: Joi.object({
  //     email: Joi.boolean().default(true),
  //     push: Joi.boolean().default(true)
  //   }).default({
  //     email: true,
  //     push: true
  //   })
  // })
})
const checkEmailExistence = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}
const createNew =async (data) => {
  try {
    // Validate ở đây giúp tránh sai sót dữ liệu và cập nhật đầy đủ các trường
    const validate = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validate)
    return createdUser
  } catch (error) { throw new Error(error) }
}
const findOneByIdUser = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}
const getDetail = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) { throw new Error(error) }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneByIdUser,
  getDetail,
  checkEmailExistence
}