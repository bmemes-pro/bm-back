import { User } from '../db/entities/User'
import { dataSource } from '../db'

export default async (): Promise<void> => {
  const usersRepo = dataSource.getRepository(User)
  const users = await usersRepo.find({ relations: { posts: true }, order: { posts: { utime: 'ASC' } } })

  for (const user of users) {
    user.created_at = user.posts[0].utime
    await usersRepo.save(user)
    await new Promise(resolve => setTimeout(resolve, 700))
    console.log('update done', user.id)
  }
}
