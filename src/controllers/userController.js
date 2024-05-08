import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import { userServices } from '~/services/userService'
import { getClientUrl } from '~/utils/utils'
const CLIENT_URL = getClientUrl()
const createNewUserGoogle = async (req, res, next) => {
  try {
    // const userData = userServices.mapUserDataToModel(req.user)
    const userData = {
      name: req.user?._json?.name,
      email: req.user?._json?.email,
      avatar: req.user?._json?.picture,
      ...userData
    }
    const emailExists = await userModel.checkEmailExistence(userData.email)
    if (!emailExists) {
      // const createdUser =
      await userModel.createNew(userData)
      // const getNewUser = await userModel.findOneByIdUser(createdUser.insertedId)
      // res.status(StatusCodes.CREATED).json({ message: getNewUser, status: StatusCodes.CREATED })
    }
    res.redirect(CLIENT_URL)
  } catch (error) {
    next(error)
    res.status(500).send('Internal server error')
  }
}
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
  getDetail,
  createNewUserGoogle
}