import { Configuration, Environment } from './types'
import * as dotenv from 'dotenv'
import * as env from 'env-var'

const nodeEnv = process.env.NODE_ENV ?? Environment.development
const isDevelopment = nodeEnv === Environment.development
const isStaging = nodeEnv === Environment.staging
const isProduction = nodeEnv === Environment.production

const envPath = isProduction ? '.env.production' : (isStaging ? '.env.staging' : '.env.development')
dotenv.config({ path: envPath })

const configuration: Configuration = {
  nodeTask: env.get('NODE_TASK').asString(),
  cluster: env.get('CLUSTER').required().asString(),
  apiServer: {
    port: env.get('API_SERVER_PORT').required().asInt(),
    origin: env.get('API_SERVER_ORIGIN').required().asString()
  },
  env: {
    isDevelopment,
    isProduction,
    isStaging,
    value: nodeEnv
  },
  db: {
    host: env.get('DB_HOST').required().asString(),
    port: env.get('DB_PORT').required().asInt(),
    username: env.get('DB_USERNAME').required().asString(),
    password: env.get('DB_PASSWORD').required().asString(),
    database: env.get('DB_DATABASE').required().asString()
  },
  redis: {
    host: env.get('REDIS_HOST').required().asString(),
    port: env.get('REDIS_PORT').required().asInt()
  },
  s3: {
    memesFolder: env.get('S3_MEMES_FOLDER').required().asString(),
    bucket: env.get('S3_BUCKET').required().asString(),
    accessKeyId: env.get('S3_ACCESS_KEY_ID').required().asString(),
    accessKeySecret: env.get('S3_ACCESS_KEY_SECRET').required().asString(),
    endpoint: env.get('S3_ENDPOINT').required().asString(),
    region: env.get('S3_REGION').required().asString()
  },
  ton: {
    provider_api_host: env.get('TON_PROVIDER_API_HOST').required().asString(),
    provider_api_key: env.get('TON_PROVIDER_API_KEY').asString(),
    target_address: env.get('TON_TARGET_ADDRESS').required().asString(), // TODO clear TON_TARGET_ADDRESS
    awards_wallet_private_key: env.get('TON_AWARDS_WALLET_PRIVATE_KEY').asString()
  },
  sentry: {
    dsn: env.get('SENTRY_DSN').asString()
  },
  enableBackgroundWorkers: env.get('ENABLE_BACKGROUND_WORKERS').required().asBool()
}

export default configuration
