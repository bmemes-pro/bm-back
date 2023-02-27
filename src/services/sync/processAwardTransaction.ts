import { IsNull, Between, ILike } from 'typeorm'
import { AwardTask } from '../../db/entities/AwardTask'
import { dataSource } from '../../db'
import { TonTransaction } from '../../db/entities/TonTransaction'
import logger from '../../config/logger'
import updatePostAwardsAmount from '../award/updatePostAwardsAmount'
import updateUserAwardsAmount from '../award/updateUserAwardsAmount'
import Sentry from '../../config/sentry'

const awardsRepository = dataSource.getRepository(AwardTask)
const transactionsRepository = dataSource.getRepository(TonTransaction)

const findAwardFor = async (transaction: TonTransaction): Promise<AwardTask | null> => {
  if (typeof transaction.message !== 'string') {
    return null
  }

  const checks = transaction.message.match(/check:.{6}/)

  if (checks === null) {
    return null
  }

  const toFind = checks[0]
  const fromDate = new Date(transaction.utime.getTime() - 1000 * 60 * 60 * 12) // tasks - 12h
  const toDate = new Date(transaction.utime.getTime() + 1000 * 60 * 60 * 12) // tasks + 12h
  const award = await awardsRepository.findOne({
    where: {
      message: ILike(`%${toFind}%`),
      found_at: IsNull(),
      sent_at: Between(fromDate, toDate)
    },
    relations: { post: { user: true } }
  })

  return award
}

const processAwardTransaction = async (transaction: TonTransaction): Promise<void> => {
  const award = await findAwardFor(transaction)

  if (award === null) {
    Sentry.captureMessage(`award for transaction ${transaction.id} not found`, 'error')
    return
  }

  award.ton_transaction = transaction
  award.found_at = new Date()
  await awardsRepository.save(award)

  transaction.processed = true
  await transactionsRepository.save(transaction)

  await updatePostAwardsAmount(award.post)
  await updateUserAwardsAmount(award.post.user)

  logger.info(`transaction ${transaction.id} has been processed`)
}

export default processAwardTransaction
