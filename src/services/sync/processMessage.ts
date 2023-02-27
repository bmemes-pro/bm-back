import { BMPMessage as BMPMessageEntity } from '../../db/entities/BMPMessage'
import { BMPAction } from '../../bmp/types'
import postCreate from '../posts/postCreate'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import Sentry from '../../config/sentry'
import userUpdate from '../users/userUpdate'

const BMPMessagesRepository = dataSource.getRepository(BMPMessageEntity)

const processMessage = async (message: BMPMessageEntity): Promise<BMPMessageEntity> => {
  if (message.action === BMPAction.post) {
    await saveMessageAsPost(message)
  } else if (message.action === BMPAction.updateProfile) {
    await updateUserProfile(message)
  } else {
    Sentry.captureMessage(`processMessage: action = ${message.action}  is uknown`, 'warning')
    return message
  }

  message.processed = true
  await BMPMessagesRepository.save(message)

  logger.info(`BMP message ${message.id} has been processed`)

  return message
}

const saveMessageAsPost = async (message: BMPMessageEntity): Promise<void> => {
  const params = {
    message: message.body.message,
    replyToHash: message.body.reply_to,
    imgUrls: message.body.img_urls,
    walletAddress: message.ton_transaction.peer_address,
    txhash: message.ton_transaction.hash
  }

  await postCreate(params)
}

const updateUserProfile = async (message: BMPMessageEntity): Promise<void> => {
  const params = {
    emojiAvatar: message.body.emoji_avatar ?? undefined,
    nickname: message.body.nickname ?? undefined,
    walletAddress: message.ton_transaction.peer_address
  }

  await userUpdate(params)
}
export default processMessage
