import { getTransactions } from '../toncenter'
import { parseRawTransaction } from '../ton'
import { dataSource } from '../../db'
import saveTransaction from '../ton/saveTransaction'
import { TargetAddress } from '../../db/entities/TargetAddress'
import processTransactionsForMessages from './processTransactionsForMessages'
import processTransactionsForAwards from './processTransactionsForAwards'

const targetAddressRepository = dataSource.getRepository(TargetAddress)

export default async (): Promise<void> => {
  const addreses = await targetAddressRepository.find()
  let haveNewTransactions = false

  for (const address of addreses) {
    const results = await getTransactions(address.address)

    for (const raw of results.reverse()) {
      const parsed = parseRawTransaction(raw)
      if (parsed === null) { // probably thos fake internal transaction
        continue
      }
      const savedResult = await saveTransaction(parsed, address)
      haveNewTransactions = savedResult.isNew || haveNewTransactions
    }
  }

  if (haveNewTransactions) {
    await processTransactionsForMessages()
    await processTransactionsForAwards()
  }
}
