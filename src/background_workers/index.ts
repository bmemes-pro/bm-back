import { setupWorker, setupQueue, NAMES } from './utils'
import syncTransactions from '../services/sync/syncTransactions'
import logger from '../config/logger'
import updatePostsStats from '../services/viewlog/updatePostsStats'
import createAwardTasksService from '../services/award/createTasks'
import sendNextTransaction from '../services/award/sendTransaction'
import calculatePostsScores from '../services/award/calculatePostsScores'

// https://elmah.io/tools/cron-parser

export default async (): Promise<void> => {
  const syncQueue = setupQueue(NAMES.QUEUES.SYNC)
  const countsQueue = setupQueue(NAMES.QUEUES.COUNTS)
  const awardsQueue = setupQueue(NAMES.QUEUES.AWARDS)

  await setupWorker(
    syncQueue,
    [{
      name: NAMES.JOBS.SYNC_TRANSACTIONS,
      cron: '0/10 * * * * *',
      func: syncTransactions
    }]
  )

  await setupWorker(
    countsQueue,
    [{
      name: NAMES.JOBS.CALCULATE_COUNTS,
      cron: '0 * * * * *',
      func: updatePostsStats
    },
    {
      name: NAMES.JOBS.CALCULATE_SCORES,
      cron: '20 0/30 * * * *',
      func: calculatePostsScores
    }]
  )

  await setupWorker(
    awardsQueue,
    [{
      name: NAMES.JOBS.CREATE_AWARD_TASKS,
      cron: '0 0 9 * * *',
      func: createAwardTasksService
    },
    // {
    //   name: NAMES.JOBS.CREATE_AWARD_TASKS_2,
    //   cron: '0 0 9 */2 * *',
    //   func: createAwardTasksService
    // },
    {
      name: NAMES.JOBS.SEND_AWARD_TRANSACTION,
      cron: '10 * * * * *',
      func: sendNextTransaction
    }]
  )

  logger.info('Workers initializing DONE')
}
