import { DataSource } from 'typeorm'
import options from './data_source_options'
import { createDatabase } from 'typeorm-extension'
import logger from '../config/logger'

export const dataSource = new DataSource(options)

const isDatabaseNotExist = (error: any): boolean => {
  if (typeof error === 'object') {
    const errorObject = error as { message: string }

    if (typeof errorObject.message === 'string') {
      return errorObject.message.toLocaleLowerCase().match(/database (.+) does not exist/) != null
    }
  }
  return false
}

const initialize = async (): Promise<void> => {
  try {
    await dataSource.initialize()

    logger.info('TypeORM initializing DONE')
  } catch (error) {
    if (isDatabaseNotExist(error)) {
      logger.info('creating database...')

      await createDatabase({ options })

      await initialize()

      return
    }

    throw error
  }
}

export default initialize
