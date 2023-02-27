import { TonTransaction } from '../../db/entities/TonTransaction'
import processAwardTransaction from './processAwardTransaction'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import { TargetAddress } from '../../db/entities/TargetAddress'
import { IsNull } from 'typeorm'

const addressRepository = dataSource.getRepository(TargetAddress)
const transactionsRepository = dataSource.getRepository(TonTransaction)

const processTransactionsForAwards = async (): Promise<void> => {
  const awardsAddresses = await addressRepository.findBy({ is_main: false })

  const unprocessedTransactions = await transactionsRepository.findBy({
    target_address: awardsAddresses, // only for awards addresses
    processed: false,
    income: IsNull() // only expense transactions
  })

  if (unprocessedTransactions.length === 0) {
    return
  }

  logger.info('process new transactions for awards ...')

  for (const transaction of unprocessedTransactions) {
    await processAwardTransaction(transaction)
  }

  logger.info('process new transactions for awards DONE')
}

export default processTransactionsForAwards
