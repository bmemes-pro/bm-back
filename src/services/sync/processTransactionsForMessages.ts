import { TonTransaction as TonTransactionEntity } from '../../db/entities/TonTransaction'
import processTransaction from './processTransaction'
import processMessages from './processMessages'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import { TargetAddress } from '../../db/entities/TargetAddress'
import { IsNull } from 'typeorm'

const addressRepository = dataSource.getRepository(TargetAddress)
const transactionsRepository = dataSource.getRepository(TonTransactionEntity)

const processTransactionsForMessages = async (): Promise<void> => {
  const mainAddresses = await addressRepository.findBy({ is_main: true })

  const unprocessedTransactions = await transactionsRepository.findBy({
    target_address: mainAddresses, // only for main address
    processed: false,
    expense: IsNull() // only incoming transactions
  })

  if (unprocessedTransactions.length === 0) {
    return
  }

  logger.info('process new transactions for messages ...')

  for (const transaction of unprocessedTransactions) {
    await processTransaction(transaction)
    logger.info(`transaction ${transaction.id} has been processed`)
  }

  logger.info('process new transactions for messages DONE')

  await processMessages()
}

export default processTransactionsForMessages
