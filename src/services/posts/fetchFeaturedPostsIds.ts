import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import { MoreThan } from 'typeorm'
import logger from '../../config/logger'
import cache from '../../config/cache'

const POSTS_BY_USER = 3
const THRESHHOLD_RATE = 0.15

const postsRepository = dataSource.getRepository(Post)

const fetchFeaturedPostsIds = async (fromDate: Date): Promise<number[]> => {
  const cacheKey = 'FeaturedPostsIds' + fromDate.toISOString().slice(0, 13)
  const cachedResult = cache.get(cacheKey)

  if (Array.isArray(cachedResult)) {
    return cachedResult
  }

  logger.info('...calculating fetchFeaturedPostsIds')
  const result: number[] = []
  const posts = rangePosts(await selectRecentPosts(fromDate))
  const scores = posts.map(post => post.score)
  const maxScore = Math.max(...scores)
  const thresholdScore = Math.round(THRESHHOLD_RATE * maxScore)

  posts.reduce(function (group, post) {
    group[post.user_id] = group[post.user_id] ?? []
    if (group[post.user_id].length < POSTS_BY_USER) {
      group[post.user_id].push(post)
      if (post.score >= thresholdScore) {
        result.push(post.id)
      }
    }
    return group
  }, Object.create(null))

  cache.set(cacheKey, result)

  return result
}

const rangePosts = (posts: Post[]): Post[] => {
  return posts.sort((p1, p2) => {
    return p2.score - p1.score
  })
}

const selectRecentPosts = async (fromDate: Date): Promise<Post[]> => {
  const posts = await postsRepository.find({
    where: {
      hidden: false,
      utime: MoreThan(fromDate)
    }
  })

  return posts
}

export default fetchFeaturedPostsIds
