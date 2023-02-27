/* eslint-disable @typescript-eslint/naming-convention */

const VALID_KEYS = ['bmp', 'action', 'message', 'tags', 'img_urls', 'reply_to']

export default (object: any): boolean => {
  const { reply_to, message, tags, img_urls } = object

  const keys = Object.keys(object)
  const othersKeys = keys.filter(key => !VALID_KEYS.includes(key))

  if (othersKeys.length > 0) {
    return false
  }

  if (typeof message !== 'string' && message !== null) {
    return false
  }

  if (typeof message === 'string' && message.trim().length === 0) {
    return false
  }

  if (typeof reply_to !== 'string' && reply_to !== null) {
    return false
  }

  if (reply_to !== null && reply_to.trim().length === 0) {
    return false
  }

  if (!Array.isArray(tags)) {
    return false
  }

  if (tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0)) {
    return false
  }

  if (!Array.isArray(img_urls)) {
    return false
  }

  if (img_urls.some(url => typeof url !== 'string' || url.trim().length === 0)) {
    return false
  }

  if (message === null && img_urls.length === 0) {
    return false
  }

  return true
}
