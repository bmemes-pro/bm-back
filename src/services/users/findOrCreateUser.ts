
import { User } from '../../db/entities/User'
import { Repository } from 'typeorm'

const findOrCreateUser = async (walletAddress: string, repository: Repository<User>): Promise<User> => {
  let user = await repository.findOneBy({ wallet_address: walletAddress })

  if (user === null) {
    user = repository.create({ wallet_address: walletAddress, created_at: new Date() })
    await repository.save(user)
  }
  return user
}

export default findOrCreateUser
