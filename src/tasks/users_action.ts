import { User } from '../db/entities/User'
import { dataSource } from '../db'
import { Post } from '../db/entities/Post'
import { IsNull } from 'typeorm'

export default async (): Promise<void> => {
  const usersRepo = dataSource.getRepository(User)
  const postsRepo = dataSource.getRepository(Post)

  const users = await usersRepo.find()

  for (const user of users) {
    user.posts_count = await postsRepo.countBy({ user_id: user.id, hidden: false, reply_to_post_id: IsNull() })
    await usersRepo.save(user)
    await new Promise(resolve => setTimeout(resolve, 700))
    console.log('update user', user.id)
  }
}
