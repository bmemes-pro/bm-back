import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import { FindOptionsOrder, FindOptionsWhere, MoreThan } from 'typeorm'

const postsRepository = dataSource.getRepository(Post)

const DEFAULT_COUNT = 20
const DEFAULT_OFFSET = 0

interface Input {
  count?: number
  offset?: number
  mode?: string
}

interface Output {
  list: Post[]
  count: number
}

const whereObjectForTopMode = (): FindOptionsWhere<Post> => {
  return {
    hidden: false,
    awards_amount: MoreThan(1.1)
  }
}

const defaultWhereObject = (): FindOptionsWhere<Post> => {
  return {
    hidden: false
  }
}

const postIndex = async (params: Input): Promise<Output> => {
  const { count, offset, mode } = params

  const where = mode === 'hot' ? await whereObjectForTopMode() : defaultWhereObject()
  const order: FindOptionsOrder<Post> = {
    utime: 'DESC',
    replies: { utime: 'ASC' }
  }

  const posts = await postsRepository.find({
    where,
    order,
    take: count ?? DEFAULT_COUNT,
    skip: offset ?? DEFAULT_OFFSET,
    relations: {
      user: true,
      replies: {
        user: true
      },
      parent: { user: true, replies: { user: true } }
    }
  })

  posts.forEach(post => { // two first comments
    post.replies = post.replies.slice(0, 2)
  })

  const postsCount = await postsRepository.countBy(where)

  return { count: postsCount, list: posts }
}

export default postIndex
