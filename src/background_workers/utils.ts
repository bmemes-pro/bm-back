import { Queue, Worker, QueueEvents } from 'bullmq'
import configuration from '../config'
import logger from '../config/logger'
import Sentry from '../config/sentry'

export const NAMES = {
  QUEUES: {
    SYNC: 'SYNC',
    COUNTS: 'COUNTS',
    AWARDS: 'AWARDS'
  },
  JOBS: {
    SYNC_TRANSACTIONS: 'SYNC_TRANSACTIONS',
    CALCULATE_COUNTS: 'CALCULATE_COUNTS',
    CALCULATE_SCORES: 'CALCULATE_SCORES',
    CREATE_AWARD_TASKS: 'CREATE_AWARD_TASKS',
    SEND_AWARD_TRANSACTION: 'SEND_AWARD_TRANSACTION'
  }
}

const connection = configuration.redis

export const setupQueue = (name: string): InstanceType<typeof Queue> => {
  const queue = new Queue(name, { connection })
  const queueEvents = new QueueEvents(name, { connection })

  queueEvents.on('completed', ({ jobId }) => {
    logger.debug(`job done: queue=${name} id=${jobId}`)
  })

  queueEvents.on(
    'failed',
    ({ jobId, failedReason }) => {
      Sentry.captureMessage(`job failed: queue=${name} id=${jobId} ${failedReason}`, 'error')
    }
  )

  return queue
}

export const setupWorker = async (
  queue: Queue,
  jobs: Array<{
    name: string
    cron: string
    func: () => Promise<void>
  }>
): Promise<InstanceType<typeof Worker>> => {
  const worker = new Worker(queue.name, async (job) => {
    logger.debug(`new  job: queue=${queue.name} name=${job.name} id=${job.id ?? '?'}`)

    const _job = jobs.find(({ name }) => name === job.name)

    if (_job === undefined) {
      throw new Error(`undefined job: queue=${queue.name} name=${job.name}`)
    }

    await _job.func()
  },
  { connection }
  )

  for (const job of jobs) {
    await queue.add(
      job.name,
      {},
      {
        repeat: {
          pattern: job.cron
        }
      }
    )
  }

  return worker
}
