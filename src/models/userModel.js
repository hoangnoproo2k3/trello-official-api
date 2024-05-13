import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  googleId:Joi.string().trim().strict(),
  name: Joi.string().required().min(3).max(50).trim().strict(),
  email: Joi.string().email().required().min(3).trim().strict(),
  password: Joi.string().trim().strict(),
  avatar: Joi.string().uri().trim().strict(),
  permissions: Joi.array().items(Joi.string().valid('admin', 'member', 'guest')).default(['member']),
  boards: Joi.array().items(Joi.string()),
  accountStatus: Joi.string().valid('active', 'suspended', 'locked').default('active'),
  creationDate: Joi.date().default(Date.now),
  lastUpdateDate: Joi.date().default(Date.now),
  accessToken:Joi.string().trim().strict(),
  refreshToken:Joi.string().trim().strict()
})
const checkEmailExistence = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}
const createNewUser =async (data) => {
  try {
    // Validate ở đây giúp tránh sai sót dữ liệu và cập nhật đầy đủ các trường
    const validate = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validate)
    return createdUser
  } catch (error) { throw new Error(error) }
}
const findOneByIdUser = async (id) => {
  try {
    const query = {}
    if (ObjectId.isValid(id)) {
      query.$or = [
        { googleId: id },
        { _id: new ObjectId(id) }
      ]
    } else {
      query.googleId = id
    }

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne(query)
    return result
  } catch (error) { throw new Error(error) }
}
const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result
  } catch (error) { throw new Error(error) }
}
const getUsers = async (page, pageSize) => {
  let skip = 1
  let limit = 10
  if (page && pageSize) {
    skip = (page - 1) * pageSize
    limit = pageSize
  }
  try {
    const users = await GET_DB().collection(USER_COLLECTION_NAME).find({}).skip(skip).limit(limit).toArray()
    return users
  } catch (error) {
    throw new Error('Error getting users: ' + error.message)
  }
}
const getUsersCount = async () => {
  try {
    const count = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments()
    return count
  } catch (error) {
    throw new Error('Error getting users count: ' + error.message)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNewUser,
  checkEmailExistence,
  findOneByIdUser,
  findOneByEmail,
  getUsers,
  getUsersCount
}