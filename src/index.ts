import initialize_data_base from './db'
import initialize_api_server from './api_server'
import initialize_background_workers from './background_workers'
import config from './config'
import tasks from './tasks'
import Sentry from './config/sentry'

const main = async (): Promise<void> => {
  await initialize_data_base()

  const taskToRun = typeof config.nodeTask === 'string' ? config.nodeTask : undefined
  if (taskToRun !== undefined) {
    if (taskToRun in tasks) {
      // @ts-expect-error
      await tasks[taskToRun]()
    } else {
      throw new Error(`undefined NODE_TASK: ${taskToRun}`)
    }
    return
  }

  await initialize_api_server()

  if (config.enableBackgroundWorkers) {
    await initialize_background_workers()
  }
}

main().catch((e) => {
  Sentry.captureException(e)
})
