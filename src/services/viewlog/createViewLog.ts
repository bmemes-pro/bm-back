import isbot from 'isbot'
import { ViewLog } from '../../db/entities/ViewLog'
import { dataSource } from '../../db'
import isSharingUserAgent from './isSharingUserAgent'

interface Input {
  postId: number
  userAgent?: string
  userIp?: string
  byApi?: boolean
  byFrontend?: boolean
  byShare?: boolean
  byLike?: boolean
}

export const trimedStringOrUndefined = (m: string | undefined): string | undefined => {
  if (m === undefined || m === null) {
    return undefined
  }

  const result = m.trim()

  return result.length > 0 ? result : undefined
}

const logRepository = dataSource.getRepository(ViewLog)

const createLog = async ({ postId, userAgent, userIp, byApi = false, byFrontend = false, byShare = false, byLike = false }: Input): Promise<void> => {
  const toSave = new ViewLog()

  const _userAgent = trimedStringOrUndefined(userAgent)

  toSave.date = new Date()
  toSave.post_id = postId
  toSave.user_agent = _userAgent
  toSave.user_ip = trimedStringOrUndefined(userIp)
  toSave.by_api = byApi
  toSave.by_frontend = byFrontend
  toSave.by_share = byShare
  toSave.by_like = byLike
  toSave.is_bot_user_agent = isbot(_userAgent)
  toSave.is_sharing_user_agent = isSharingUserAgent(_userAgent)

  await logRepository.save(toSave)
}

export default createLog
