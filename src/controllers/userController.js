import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { userModel } from '~/models/userModel'

const createNewUserWithGoogle = async (req, res, next) => {
  try {
    const { email, googleId, avatar, ...otherUserData } = req.body
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' })
    }
    let newUser
    const emailExists = await userModel.checkEmailExistence(email)
    if (emailExists) {
      newUser = await userModel.findOneByEmail(email)
    } else {
      const createUser = await userModel.createNewUser({ email, googleId, avatar, ...otherUserData })
      newUser = await userModel.findOneByIdUser(createUser.insertedId)
    }
    return res.status(StatusCodes.CREATED).json({ message: newUser, status: StatusCodes.CREATED })
  } catch (error) {
    next(error)
  }
}
const getDetailUserWithEmail = async (req, res, next) => {
  try {
    const email = req.body.email
    const user = await userModel.findOneByEmail(email)
    res.status(StatusCodes.OK).json({ message: user, status: StatusCodes.OK })
  } catch (error) { next(error) }
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
const getResultSearchUser = async (req, res, next) => {
  try {
    const searchTerm = req.query.q
    const board = await boardModel.findOneByIdBoard(req.body.boardId)
    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }
    const { ownerId, memberIds } = board
    const listBoards = await userModel.getSearchUser(searchTerm, ownerId, memberIds)
    return res.status(StatusCodes.OK).json({ getUsers: listBoards, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
export const userController = {
  createNewUserWithGoogle,
  getDetailUserWithEmail,
  getListUsers,
  getResultSearchUser
}