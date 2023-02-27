import { createLogger, transports, format } from 'winston'
import configuration from '../config'

const logger = createLogger({
  transports: [
    new transports.Console({ format: format.simple() })
  ],
  exitOnError: false
})

logger.info(`Config mode: ${configuration.env.value}`)
if (typeof configuration.nodeTask === 'string') {
  logger.info(`Run task: ${configuration.nodeTask}`)
}

export default logger
