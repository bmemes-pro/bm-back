import { User } from '../../db/entities/User'
import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import { MoreThan } from 'typeorm'

const postsRepository = dataSource.getRepository(Post)
const usersRepository = dataSource.getRepository(User)

const updateUserAwardsAmount = async (user: User): Promise<void> => {
  const posts = await postsRepository.findBy({ user_id: user.id, awards_amount: MoreThan(0.0) })

  const awardsAmount = posts.reduce((sum, post) => {
    return sum + parseFloat(post.awards_amount.toString())
  }, 0.0)

  user.awards_amount = awardsAmount
  await usersRepository.save(user)

  logger.info(`updating user ${user.id} awards amount DONE`)
}

export default updateUserAwardsAmount
