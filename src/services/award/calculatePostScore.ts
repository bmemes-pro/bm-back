import { Not } from 'typeorm'
import { Post } from '../../db/entities/Post'
import { ViewLog } from '../../db/entities/ViewLog'
import { dataSource } from '../../db'
import Sentry from '../../config/sentry'

const REPLIES_SCORE_RATE = 0.2
const COMMENT_SCORE_RATE = 1.3

const postsRepository = dataSource.getRepository(Post)
const logsRepository = dataSource.getRepository(ViewLog)

const calculatePostScore = async (post: Post): Promise<void> => {
  const likesCount = post.likes_count
  const shareLogCount = await logsRepository.countBy({ post_id: post.id, is_sharing_user_agent: true })

  let newScore = likesCount + shareLogCount * 5

  newScore = Math.round(newScore * rateByPostType(post))

  // if it's comment
  if (typeof post.reply_to_post_id === 'number') {
    newScore = Math.round(newScore * COMMENT_SCORE_RATE)
  } else {
    const replies = await postsRepository.findBy({ reply_to_post_id: post.id, user_id: Not(post.user_id) })
    const repliesScore = replies.reduce((sum, post) => sum + post.score, 0.0)
    newScore += Math.round(REPLIES_SCORE_RATE * repliesScore)
  }

  try {
    // save to DB
    post.score = newScore
    post.need_update_score = false

    await postsRepository.save(post)

    // to update parent post
    if (typeof post.reply_to_post_id === 'number') {
      await postsRepository.update(
        {
          id: post.reply_to_post_id
        },
        { need_update_score: true }
      )
    }
  } catch (e) {
    Sentry.captureException(e)
  }
}

const rateByPostType = (post: Post): number => {
  let result = 1
  const words = (post.message ?? '').trim().split(' ').filter(word => word.length > 2)

  if (words.length >= 10) {
    result = result * 1.2
  }

  if (words.length >= 20) {
    result = result * 1.2
  }

  return result
}

export default calculatePostScore
