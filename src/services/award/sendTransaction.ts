import { IsNull } from 'typeorm'
import { dataSource } from '../../db'
import { AwardTask } from '../../db/entities/AwardTask'
import sendTransactions from '../ton/sendTransactions'
import logger from '../../config/logger'

const awardsRepository = dataSource.getRepository(AwardTask)

export default async (): Promise<void> => {
  const award = await awardsRepository.findOne({
    where: { sent_at: IsNull() },
    relations: { post: { user: true } }
  })

  if (award === null) {
    return
  }

  logger.info(`send award task ${award.id} ...`)

  award.sent_at = new Date()
  await awardsRepository.save(award)

  await sendTransactions([{
    amount: award.amount,
    targetAddress: award.post.user.wallet_address,
    message: award.message
  }])

  logger.info(`send award task ${award.id} DONE`)
}
