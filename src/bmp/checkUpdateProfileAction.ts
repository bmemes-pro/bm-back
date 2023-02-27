/* eslint-disable @typescript-eslint/naming-convention */

const VALID_KEYS = ['bmp', 'action', 'nickname', 'emoji_avatar']

export default (object: any): boolean => {
  const { nickname, emoji_avatar } = object

  const keys = Object.keys(object)
  const othersKeys = keys.filter(key => !VALID_KEYS.includes(key))

  if (othersKeys.length > 0) {
    return false
  }

  if (typeof nickname !== 'string' && nickname !== null) {
    return false
  }

  if (typeof nickname === 'string' && nickname.trim().length === 0) {
    return false
  }

  if (typeof emoji_avatar !== 'string' && emoji_avatar !== null) {
    return false
  }

  if (typeof emoji_avatar === 'string' && emoji_avatar.trim().length === 0) {
    return false
  }

  if (nickname === null && emoji_avatar === null) {
    return false
  }

  return true
}
