import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import calculatePostScore from './calculatePostScore'

const postsRepository = dataSource.getRepository(Post)

const calculatePostsScores = async (): Promise<void> => {
  const posts = await postsRepository.findBy({ need_update_score: true })

  if (posts.length === 0) {
    return
  }

  logger.info(`updating posts scores ${posts.length} ...`)

  for (const post of posts) {
    await calculatePostScore(post)
  }

  logger.info('updating posts scores DONE')
}

export default calculatePostsScores
