// import sendTransaction from '../services/award/sendTransaction'
// import processTransactionsForAwards from '../services/sync/processTransactionsForAwards'
import createAwardTasks from '../services/award/createTasks'

export default async (): Promise<void> => {
  await createAwardTasks()
}
