import { BMPMessage as BMPMessageEntity } from '../../db/entities/BMPMessage'
import processMessage from './processMessage'
import { dataSource } from '../../db'
import logger from '../../config/logger'

const BMPMessagesRepository = dataSource.getRepository(BMPMessageEntity)

const processMessages = async (): Promise<void> => {
  logger.info('process new messages...')

  const unprocessedMessages = await BMPMessagesRepository.find({
    relations: {
      ton_transaction: true
    },
    where: {
      processed: false
    }
  })

  for (const message of unprocessedMessages) {
    await processMessage(message)
  }

  logger.info('process new messages DONE')
}

export default processMessages
