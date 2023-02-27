import { User } from '../../db/entities/User'
import { dataSource } from '../../db'
import { isEmpty } from '../../common/utils'
import { MoreThan } from 'typeorm'

interface Input {id: string}

const usersRepository = dataSource.getRepository(User)

const userShow = async (params: Input): Promise<null | User> => {
  if (isEmpty(params.id) || isNaN(Number(params.id))) {
    throw Error('Params are not valid')
  }

  const id: number = +params.id

  const user = await usersRepository.findOne({
    where: {
      id,
      posts: { awards_amount: MoreThan(0.1) }
    },
    order: { posts: { utime: 'DESC' } },
    relations: {
      posts: {
        parent: {
          user: true,
          replies: { user: true }
        }
      }
    }
  })

  return user
}

export default userShow
