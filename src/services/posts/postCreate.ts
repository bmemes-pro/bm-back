import { Post } from '../../db/entities/Post'
import { User } from '../../db/entities/User'
import { dataSource } from '../../db'
import findOrCreateUser from '../users/findOrCreateUser'
import { isEmpty } from '../../common/utils'
import cache from '../../config/cache'

interface Input {
  message?: string
  replyToHash?: string
  walletAddress: string
  txhash: string
  imgUrls: string[]
}

const postCreate = async (params: Input): Promise<Post> => {
  if ((isEmpty(params.message) && isEmpty(params.imgUrls)) || (isEmpty(params.walletAddress) || isEmpty(params.txhash))) {
    throw Error('Params are not valid')
  }

  const post = new Post()

  post.message = params.message
  post.txhash = params.txhash
  post.img_urls = params.imgUrls
  post.utime = new Date()

  await dataSource.manager.transaction(async (transactionalEntityManager) => {
    const postsRepository = transactionalEntityManager.getRepository(Post)
    const usersRepository = transactionalEntityManager.getRepository(User)

    const user = await findOrCreateUser(params.walletAddress, usersRepository)
    post.user_id = user.id

    if (typeof params.replyToHash === 'string') {
      const parentPost = await postsRepository.findOneBy({ txhash: params.replyToHash })
      if (parentPost !== null) {
        post.reply_to_post_id = parentPost.id
        parentPost.replies_count += 1
        parentPost.need_update_score = true
        await postsRepository.save(parentPost)
      }
    } else {
      user.posts_count += 1
      await usersRepository.save(user)
    }

    await postsRepository.save(post)

    cache.del('lastPostId') // clear cache with lastPostId
    cache.del('postsCount') // clear cache with postsCount
  })

  return post
}

export default postCreate
