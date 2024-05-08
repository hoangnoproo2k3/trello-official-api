import 'dotenv/config'
export const env = {
  MONGODB_URL: process.env.MONGODB_URL,
  DATABASE_NAME:  process.env.DATABASE_NAME,
  APP_HOST:  process.env.APP_HOST,
  APP_PORT:  process.env.APP_PORT,
  BUILD_MODE:  process.env.BUILD_MODE,
  AUTHOR:  process.env.AUTHOR,
  GOOGLE_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET:process.env.GOOGLE_CLIENT_SECRET,
  CLIENT_URL:process.env.CLIENT_URL
}