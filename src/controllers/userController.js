import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'

const createNewUserWithGoogle = async (req, res, next) => {
  try {
    let getNewUser
    const emailExists = await userModel.checkEmailExistence(req.body.email)
    if (emailExists) {
      getNewUser = await userModel.findOneByEmail(req.body.email)
    } else {
      const createUser = await userModel.createNewUser(req.body)
      getNewUser = await userModel.findOneByIdUser(createUser.insertedId)
    }
    return res.status(StatusCodes.CREATED).json({ message: getNewUser, status: StatusCodes.CREATED })
  } catch (error) {
    next(error)
  }
}
const getListUsers = async (req, res, next) => {
  try {
    const { pageNumber, pageSize } = req.query
    const parsedPageNumber = parseInt(pageNumber)
    const parsedPageSize = parseInt(pageSize)
    if (parsedPageNumber <= 0 || parsedPageSize <= 0) {
      return res.status(400).json({ message: 'pageNumber và pageSize phải là số nguyên dương' })
    }
    const getUsers = await userModel.getUsers(parsedPageNumber, parsedPageSize)
    const getUsersCount = await userModel.getUsersCount()
    return res.status(StatusCodes.CREATED).json({ message: { getUsers: getUsers, getUsersCount: getUsersCount }, status: StatusCodes.CREATED })
  } catch (error) {
    next(error)
  }
}
export const userController = {
  createNewUserWithGoogle,
  getListUsers
}