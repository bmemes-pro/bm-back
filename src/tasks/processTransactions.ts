import processTransactions from '../services/sync/processTransactionsForMessages'

export default async (): Promise<void> => {
  await processTransactions()
}
