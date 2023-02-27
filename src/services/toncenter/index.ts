import axios from 'axios'
import config from '../../config'
import Sentry from '../../config/sentry'

const HOST = config.ton.provider_api_host
const KEY = config.ton.provider_api_key

const buildHeaders = (): any => {
  const result: any = {
    'Accept-Encoding': 'gzip,deflate,compress'
  }

  if (typeof KEY === 'string') {
    result['X-API-Key'] = KEY
  }

  return result
}

// TODO add types: https://dev.to/franciscomendes10866/node-typescript-json-schema-validation-using-typebox-2oee
export const getTransactions = async (address: string): Promise<any[]> => {
  const path = `${HOST}/getTransactions`
  const headers = buildHeaders()
  const params = {
    address,
    archival: true,
    limit: 15
  }
  const response = await axios.get(path, { headers, params })

  if (response.status !== 200) {
    Sentry.captureMessage(`something wrong with status: status=${response.status}`)
  }

  return response.data.result
}
