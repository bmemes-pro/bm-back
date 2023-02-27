
const SHARING_USER_AGENTS = [
  'TelegramBot (like TwitterBot)',
  'Mozilla/5.0 (compatible; vkShare; +http://vk.com/dev/Share)'
]

export default (userAgent: string | undefined | null): boolean => {
  if (userAgent === undefined || userAgent === null) {
    return false
  }

  return SHARING_USER_AGENTS.map(u => u.toLowerCase()).includes(userAgent.toLowerCase())
}
