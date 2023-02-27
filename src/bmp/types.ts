export enum BMPAction {
  post = 'post',
  updateProfile = 'update_profile'
}

export enum BMPVersion {
  v23_1 = 'v23.1'
}

export interface BMPPostMessage {
  bmp: BMPVersion
  action: BMPAction.post
  tags: string[]
  img_urls: string[]
  reply_to: string | null
  message: string | null
}

export interface BMPUpdateProfileMessage {
  bmp: BMPVersion
  action: BMPAction.updateProfile
  nickname: string | null
  emoji_avatar: string | null
}
