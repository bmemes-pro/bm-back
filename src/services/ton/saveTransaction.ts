import { TonTransaction } from '../../db/entities/TonTransaction'
import { dataSource } from '../../db'
import { TargetAddress } from '../../db/entities/TargetAddress'

interface Input {
  income?: number
  expense?: number
  hash: string
  utime: Date
  logicalTime: string
  body: any
  message?: string
  peerAddress: string
}

interface Output {
  record: TonTransaction
  isNew: boolean
}

const transactionsRepository = dataSource.getRepository(TonTransaction)

export default async (transaction: Input, targetAddress: TargetAddress): Promise<Output> => {
  const existingRecord = await transactionsRepository.findOneBy({ hash: transaction.hash })

  if (existingRecord !== undefined && existingRecord !== null) {
    return {
      record: existingRecord,
      isNew: false
    }
  }

  // save new tinsaction
  const toSave = new TonTransaction()

  toSave.target_address = targetAddress
  toSave.income = transaction.income
  toSave.expense = transaction.expense
  toSave.hash = transaction.hash
  toSave.logical_time = transaction.logicalTime
  toSave.utime = transaction.utime
  toSave.body = transaction.body
  toSave.message = transaction.message
  toSave.peer_address = transaction.peerAddress

  await transactionsRepository.save(toSave)

  return {
    record: toSave,
    isNew: true
  }
}
