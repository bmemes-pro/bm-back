import { In } from 'typeorm'
import { Post } from '../../db/entities/Post'
import { ViewLog } from '../../db/entities/ViewLog'
import { dataSource } from '../../db'
import logger from '../../config/logger'
import updatePostStats from './updatePostStats'

const postsRepository = dataSource.getRepository(Post)
const logsRepository = dataSource.getRepository(ViewLog)

const updatePostsStats = async (): Promise<void> => {
  const newLogs = await logsRepository.findBy({ processed: false })

  if (newLogs.length === 0) {
    return
  }

  let postsIds = newLogs.map(log => log.post_id)
  postsIds = [...new Set(postsIds)]

  logger.info(`updating posts counts ${postsIds.length} ...`)

  const posts = await postsRepository.findBy({ id: In(postsIds) })

  for (const post of posts) {
    await updatePostStats(post)
  }

  logger.info('updating posts counts DONE')
}

export default updatePostsStats
