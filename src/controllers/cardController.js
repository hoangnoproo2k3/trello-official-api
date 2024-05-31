import ApiError from '~/utils/ApiError'

const { StatusCodes } = require('http-status-codes')
const { cardModel } = require('~/models/cardModel')
const { columnModel } = require('~/models/columnModel')

const createNewCardWithBoard = async (req, res, next) => {
  try {
    const titleExists = await cardModel.checkNameCardExistence(req.body.title, req.body.columnId)
    if (titleExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title column đã tồn tại', status: StatusCodes.BAD_REQUEST })
    }
    const createdCard = await cardModel.createNewCard(req.body)
    const cardId = createdCard.insertedId
    const getNewCard = await cardModel.findOneByIdCard(cardId)
    await columnModel.updateColumnWithCard(req.body.columnId, cardId)
    res.status(201).json({ message: getNewCard, cardId })
  } catch (error) {
    next(error)
  }
}
const getDetailCardWithId = async (req, res, next) => {
  try {
    const cardId = req.params.cardId
    const getCards = await cardModel.findOneByIdCard(cardId)
    if (!getCards) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found!')
    }
    return res.status(StatusCodes.OK).json({ getCards: getCards, status: StatusCodes.OK })
  } catch (error) {
    next(error)
  }
}
const getCards = async (req, res, next) => {
  try {
    const getCards = await cardModel.getCardsWithColumn(req.body.columnId, req.body.boardId)
    return res.status(StatusCodes.OK).json({ getCards, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
const updateCard = async (req, res, next) => {
  try {
    const { cardId } = req.params
    await cardModel.updateCard(cardId, req.body)
    const getCardUpdate = await cardModel.findOneByIdCard(cardId)
    res.status(StatusCodes.OK).json({ message: getCardUpdate, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}

const updateCardWithDndKit =async (req, res, next) => {
  try {
    await cardModel.updateCardsDndKit(req.body.cardId, req.body.columnId)
    const getColumn = await cardModel.findOneByIdCard(req.body.cardId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
const updateCardWithUserLike = async (req, res, next) => {
  try {
    await cardModel.updateCardWithUserLike(req.body.cardId, req.body.userId)
    const getColumn = await cardModel.findOneByIdCard(req.body.cardId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
const updateCardWithUserUnlike = async (req, res, next) => {
  try {
    await cardModel.updateCardWithUserUnlike(req.body.cardId, req.body.userId)
    const getColumn = await cardModel.findOneByIdCard(req.body.cardId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
const updateCardWithUserComment = async (req, res, next) => {
  try {
    await cardModel.updateCardWithUserComment(req.params.cardId, req.body)
    const getColumn = await cardModel.findOneByIdCard(req.params.cardId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
const deleteCommentInCard = async (req, res, next) => {
  try {
    await cardModel.deleteCommentInCard(req.params.cardId, req.body.commentID)
    const getColumn = await cardModel.findOneByIdCard(req.params.cardId)
    res.status(StatusCodes.OK).json({ message: getColumn, status: StatusCodes.OK })
  }
  catch (error) {
    next(error)
  }
}
export const cardController = {
  createNewCardWithBoard,
  getCards,
  updateCard,
  getDetailCardWithId,
  updateCardWithDndKit,
  updateCardWithUserLike,
  updateCardWithUserUnlike,
  updateCardWithUserComment,
  deleteCommentInCard
}