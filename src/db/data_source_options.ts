/* eslint-disable n/no-path-concat */
import { DataSourceOptions } from 'typeorm'
import configuration from '../config'

const { db, env } = configuration

const options: DataSourceOptions = {
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.database,
  type: 'postgres',
  entities: [`${__dirname}/entities/*.{js,ts}`],
  // migrations: [`${__dirname}/migrations/*.{js,ts}`],
  // migrationsRun: true,
  synchronize: true,
  poolSize: 4, // TODO to ENVS
  logging: false,
  ssl: !env.isDevelopment,
  extra: env.isDevelopment
    ? undefined
    : {
        ssl: {
          rejectUnauthorized: false
        }
      }
}

export default options
