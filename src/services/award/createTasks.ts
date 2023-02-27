import { Post } from '../../db/entities/Post'
import { AwardTask } from '../../db/entities/AwardTask'
import { dataSource } from '../../db'
import { BMP_SIGNS } from '../../bmp/const'
import { getRandomElement } from '../../bmp/utils'
import config from '../../config'
import logger from '../../config/logger'
import { Between } from 'typeorm'

interface AuthorCounts {
  [index: string]: number
}

const postsRepository = dataSource.getRepository(Post)
const tasksRepository = dataSource.getRepository(AwardTask)

// const AMOUNTS = [5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
// const AMOUNTS = [5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5]
// const AMOUNTS = [4, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
// const AMOUNTS = [3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
const AMOUNTS = [3, 3, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] // 20

const createAwardTasks = async (): Promise<void> => {
  if (config.ton.awards_wallet_private_key === undefined) {
    return
  }

  logger.info('creating new awards tasks ...')

  const posts = rangePosts(await selectRecentPosts())
  const awardPosts: Post[] = []
  const authors: AuthorCounts = {}

  for (const amount of AMOUNTS) {
    const post = selectNextPost(posts, awardPosts, authors)
    if (post === null) {
      break
    }
    awardPosts.push(post)

    await createAward(post, amount)
  }

  logger.info('creating new awards tasks DONE')
}

const selectNextPost = (allPosts: Post[], awardPosts: Post[], authors: AuthorCounts, allowAuthorCount: number = 0): Post | null => {
  const awardPostIds = awardPosts.map(post => post.id)

  const toAwardPosts = allPosts.filter(post => !awardPostIds.includes(post.id))
  const filteredbyAuthor = toAwardPosts.filter(post => {
    const postAuthorId = post.user_id.toString()
    const authorCount = authors[postAuthorId] ?? 0
    return authorCount === allowAuthorCount
  })

  if (filteredbyAuthor.length > 0) {
    const post = filteredbyAuthor[0]
    const postAuthorId = post.user_id.toString()
    if (authors[postAuthorId] === undefined) authors[postAuthorId] = 0
    authors[postAuthorId] += 1
    return post
  }

  if (toAwardPosts.length > 0) {
    return selectNextPost(toAwardPosts, [], authors, Math.min(2, allowAuthorCount + 1))
  }

  return null
}

const rangePosts = (posts: Post[]): Post[] => {
  return posts.sort((p1, p2) => {
    return p2.score - p1.score
  })
}

const mesasge = (post: Post): string => {
  const f = `👏 award for ${config.apiServer.origin}/post/${post.id}`
  const s = getRandomElement(BMP_SIGNS)
  const ch = `check:${Math.random().toString(36).substring(2, 8)}` // add check = "...check:h6o9y3"
  return `${f}\n${s}\n${ch}`
}

const createAward = async (post: Post, amount: number): Promise<void> => {
  // console.log('award amount', amount)
  // console.log('author ', post.user_id)
  // console.log('post ', `https://bmemes.pro/post/${post.id}`)
  // console.log('----')

  const task = new AwardTask()
  task.amount = amount
  task.post = post
  task.message = mesasge(post)

  await tasksRepository.save(task)
}

const selectRecentPosts = async (): Promise<Post[]> => {
  const now = new Date()
  const fromDate = new Date(now.getTime() - 10 - 1000 * 60 * 60 * 48) // 48h ago // ->72
  const toDate = new Date(now.getTime() + 10 - 1000 * 60 * 60 * 24) // 24h ago  // ->24

  const posts = await postsRepository.find({
    where: {
      hidden: false,
      utime: Between(fromDate, toDate)
    }
  })

  return posts
}

export default createAwardTasks
