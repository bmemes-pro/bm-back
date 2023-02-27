import { In } from 'typeorm'
import { Post } from '../../db/entities/Post'
import { ViewLog } from '../../db/entities/ViewLog'
import { dataSource } from '../../db'
import Sentry from '../../config/sentry'

const postsRepository = dataSource.getRepository(Post)
const logsRepository = dataSource.getRepository(ViewLog)

const countsGroupByUserAgent = (logs: ViewLog[]): number[] => {
  const map = new Map()
  logs.forEach(l => {
    let _key = l.user_agent
    if (_key !== undefined && _key !== null) {
      _key = _key.toString().toLowerCase()
      const count = map.get(_key)
      if (count === undefined) {
        map.set(_key, 1)
      } else {
        map.set(_key, parseInt(count) + 1)
      }
    }
  })
  return [...map.values()]
}
const smartCountByUserAgent = (logs: ViewLog[]): number => {
  const grouped = countsGroupByUserAgent(logs)
  const rawCount = grouped.reduce((sum, item) => sum + 1 + (Math.log(item) / Math.log(3)), 0.0)
  return Math.round(rawCount)
}

const updatePostStats = async (post: Post): Promise<void> => {
  const allLogs = await logsRepository.find({ where: { post_id: post.id } })
  const unprocessedLogs = allLogs.filter(log => !log.processed)
  const likeLogs = allLogs.filter(log => log.by_like)
  const viewByFrontendLogs = allLogs.filter(log => log.by_frontend && !log.is_bot_user_agent)
  const viewByApiLogs = allLogs.filter(log => log.by_api && !log.is_bot_user_agent)

  // console.log('all likes', likeLogs.length)
  // console.log('by frontend', viewByFrontendLogs.length)
  // console.log('by api', viewByApiLogs.length)
  // console.log('smart likes', smartCountByUserAgent(likeLogs))
  // console.log('smart by front', smartCountByUserAgent(viewByFrontendLogs))
  // console.log('smart by api', smartCountByUserAgent(viewByApiLogs))

  const likes = smartCountByUserAgent(likeLogs)

  const views = Math.min(
    smartCountByUserAgent(viewByFrontendLogs),
    smartCountByUserAgent(viewByApiLogs)
  ) + likes

  post.likes_count = likes
  post.views_count = views
  post.need_update_score = true

  try {
    await postsRepository.save(post)
    // proccess logs
    await logsRepository.update(
      {
        id: In(unprocessedLogs.map(log => log.id))
      },
      { processed: true }
    )
  } catch (e) {
    Sentry.captureException(e)
  }
}

export default updatePostStats
