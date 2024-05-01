/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
import { slugify } from "~/utils/formatters"

const createNew = async (reqBody) => {
  try {
    // process logic data
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    return newBoard
  } catch (error) { throw error }
}
export const boardServices = {
  createNew
}