import mongoose from 'mongoose'
import { logger } from '../structures/Logger'
import { configDB } from '../util/validateEnv'

export const initDB = async () => {
  const { name, uri } = configDB
  try {
    await mongoose.connect(uri)
    logger.info(`Connected to ${name}`)
  } catch (err) {
    logger.error(err, `Failed to connect to ${name}`)
  }
}
