import { BMPMessage as BMPMessageEntity } from '../../db/entities/BMPMessage'
import { TonTransaction as TonTransactionEntity } from '../../db/entities/TonTransaction'
import { dataSource } from '../../db'
import { parseMessage } from '../../bmp'
import { BMPPostMessage, BMPUpdateProfileMessage } from '../../bmp/types'

const BMPMessagesRepository = dataSource.getRepository(BMPMessageEntity)
const transactionsRepository = dataSource.getRepository(TonTransactionEntity)

const processTransaction = async (transaction: TonTransactionEntity): Promise<TonTransactionEntity> => {
  const result = parseMessage(transaction.message)

  if (result.isValid && result.object !== undefined) {
    await saveBMPMessage(result.object, transaction)
  }

  transaction.processed = true
  await transactionsRepository.save(transaction)

  return transaction
}

const saveBMPMessage = async (message: BMPPostMessage | BMPUpdateProfileMessage, transaction: TonTransactionEntity): Promise<void> => {
  const bmpMessage = new BMPMessageEntity()

  bmpMessage.action = message.action
  bmpMessage.body = message
  bmpMessage.ton_transaction = transaction

  await BMPMessagesRepository.save(bmpMessage)
}

export default processTransaction
