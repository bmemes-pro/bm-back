import * as Sentry from '@sentry/node'
import configuration from '../config'

Sentry.init({
  dsn: configuration.sentry.dsn ?? '',
  tracesSampleRate: 0.7,
  attachStacktrace: true,
  environment: configuration.cluster
})

export default Sentry
