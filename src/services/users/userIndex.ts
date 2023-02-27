import { User } from '../../db/entities/User'
import { dataSource } from '../../db'

const DEFAULT_COUNT = 20
const DEFAULT_OFFSET = 0

enum orderByEnum {
  createdAt = 'created_at',
  awardsAmount = 'awards_amount'
}

enum orderDirectionEnum {
  DESC = 'DESC',
  ASC = 'ASC'
}

interface Input {
  count?: number
  offset?: number
  orderBy?: orderByEnum
  orderDirection?: orderDirectionEnum
}

const isValid = (field: string | undefined, enumObject: Record<string, orderByEnum | orderDirectionEnum>): boolean => {
  if (field === undefined) {
    return false
  }

  const enumValues = Object.values(enumObject) as string[]
  return enumValues.includes(field)
}

const userIndex = async (params: Input): Promise<User[]> => {
  const orderBy = isValid(params.orderBy, orderByEnum) ? params.orderBy as orderByEnum : orderByEnum.awardsAmount
  const orderDirection = isValid(params.orderDirection, orderDirectionEnum) ? params.orderDirection as orderDirectionEnum : orderDirectionEnum.DESC

  const users = await dataSource
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .limit(params.count ?? DEFAULT_COUNT)
    .offset(params.offset ?? DEFAULT_OFFSET)
    .orderBy(`user.${orderBy}`, orderDirection)
    .getMany()
  return users
}

export default userIndex
