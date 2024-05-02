/* eslint-disable quotes */

import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"

const { userModel } = require("~/models/userModel")

/* eslint-disable no-useless-catch */
const createNew = async (reqBody) => {
  try {
    const createdUser = await userModel.createNew(reqBody)
    // get data
    const getNewUser = await userModel.findOneByIdUser(createdUser.insertedId)
    // return createdUser
    return getNewUser
  } catch (error) { throw error }
}
const getDetail = async (userId) => {
  try {
    const user = await userModel.getDetail(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) { throw error }
}
export const userServices = {
  createNew,
  getDetail
}