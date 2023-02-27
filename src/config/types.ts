export enum Environment {
  development = 'development',
  staging = 'staging',
  production = 'production',
}

export interface Configuration {
  nodeTask?: string
  cluster: string
  apiServer: {
    port: number
    origin: string
  }
  env: {
    isProduction: boolean
    isDevelopment: boolean
    isStaging: boolean
    value: string
  }
  db: {
    host: string
    port: number
    username: string
    password: string
    database: string
  }
  redis: {
    host: string
    port: number
  }
  s3: {
    memesFolder: string
    bucket: string
    accessKeyId: string
    accessKeySecret: string
    endpoint: string
    region: string
  }
  ton: {
    provider_api_host: string
    provider_api_key?: string
    target_address: string
    awards_wallet_private_key?: string
  }
  sentry: {
    dsn?: string
  }
  enableBackgroundWorkers: boolean
}
