import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import { AwardTask } from '../../db/entities/AwardTask'
import { Not, IsNull } from 'typeorm'

const postsRepository = dataSource.getRepository(Post)
const awardsRepository = dataSource.getRepository(AwardTask)

const updatePostAwardsAmount = async (post: Post): Promise<void> => {
  const awards = await awardsRepository.find({
    where: {
      postId: post.id,
      found_at: Not(IsNull())
    }
  })

  const awardsAmount = awards.reduce((sum, award) => {
    return sum + parseFloat(award.amount.toString())
  }, 0.0)
  post.awards_amount = awardsAmount
  await postsRepository.save(post)

  logger.info(`updating post ${post.id} awards amount DONE`)
}

export default updatePostAwardsAmount
