import { User } from '../../db/entities/User'
import { dataSource } from '../../db'
import findOrCreateUser from './findOrCreateUser'
import Sentry from '../../config/sentry'

interface Input {
  walletAddress: string
  nickname?: string
  emojiAvatar?: string
}

const usersRepository = dataSource.getRepository(User)

const userUpdate = async (params: Input): Promise<void> => {
  const { walletAddress } = params

  if (typeof walletAddress !== 'string') {
    throw new Error('undefined walletAddress')
  }

  const user = await findOrCreateUser(walletAddress, usersRepository)

  if (user === null) {
    Sentry.captureMessage(`user with wallet address = ${params.walletAddress} not found`, 'warning')
    return
  }

  if (typeof params.nickname === 'string') {
    user.nickname = params.nickname
  }

  if (typeof params.emojiAvatar === 'string') {
    user.emoji_avatar = params.emojiAvatar
  }

  await usersRepository.save(user)
}

export default userUpdate
