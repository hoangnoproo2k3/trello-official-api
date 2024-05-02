/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes"
import { userServices } from "~/services/userService"

// import User from '~/models/userModel'
const createNew = async (req, res, next) => {
  try {
    const createBoard = await userServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json({ message: createBoard, status: StatusCodes.CREATED })
  } catch (error) { next(error) }
}
const getDetail = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userServices.getDetail(userId)
    res.status(StatusCodes.OK).json({ message: user, status: StatusCodes.OK })
  } catch (error) { next(error) }
}
export const userController = {
  createNew,
  getDetail
}