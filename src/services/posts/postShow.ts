import { Post } from '../../db/entities/Post'
import { dataSource } from '../../db'
import { isEmpty } from '../../common/utils'

interface Input {id: string}

const postsRepository = dataSource.getRepository(Post)

const postShow = async (params: Input): Promise<null | Post> => {
  if (isEmpty(params.id) || isNaN(Number(params.id))) {
    throw Error('Params are not valid')
  }

  const id: number = +params.id

  const post = await postsRepository.findOne({
    where: {
      id,
      hidden: false
    },
    relations: { replies: { user: true }, user: true },
    order: { replies: { utime: 'ASC' } }
  })

  if (post === null) {
    return null
  }

  post.replies = post.replies.filter(reply => !reply.hidden)
  return post
}

export default postShow
