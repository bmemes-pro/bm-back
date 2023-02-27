import configuration from '../config'
import { BMP_SIGNS } from '../bmp/const'
import { Post } from '../db/entities/Post'
import { dataSource } from '../db'
import cache from '../config/cache'

interface InfoObject {
  targetAddress: string
  bmpSigns: string[]
  lastPostId: number
  postsCount: number // TODO clear postsCount
}

const postsRepository = dataSource.getRepository(Post)

const buildInfoObject = (lastPostId: number, postsCount: number): InfoObject => {
  return {
    targetAddress: configuration.ton.target_address,
    bmpSigns: BMP_SIGNS,
    lastPostId,
    postsCount
  }
}

const getInfo = async (): Promise<InfoObject> => {
  const cachedId = cache.get('lastPostId')
  const cachedCount = cache.get('postsCount')
  let lastPostId: number
  let postsCount: number

  if (cachedId !== undefined && cachedId !== null && typeof cachedId === 'number') {
    lastPostId = cachedId
  } else {
    const latestPosts = await postsRepository.find({ order: { id: 'DESC' }, take: 1 })
    lastPostId = (latestPosts.length > 0) ? latestPosts[0].id : 0
    cache.set('lastPostId', lastPostId, 60 * 60 * 24)
  }

  if (cachedCount !== undefined && cachedCount !== null && typeof cachedCount === 'number') {
    postsCount = cachedCount
  } else {
    postsCount = await postsRepository.countBy({ hidden: false })
    cache.set('postsCount', postsCount, 60 * 60 * 24)
  }

  return buildInfoObject(lastPostId, postsCount)
}

export default getInfo
