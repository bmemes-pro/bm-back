import { parseMessage } from '../../src/bmp/index'
import { BMPAction, BMPVersion } from '../../src/bmp/types'

const expectedInvalidResult = { isValid: false }

describe('parseMessage INVALID output', () => {
  describe('when input is empty string', () => {
    const input = ' '

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when action = update_profile', () => {
    describe('and nickname has wrong type', () => {
      test('returns isValid=false (nickname is empty string)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": " ", "emoji_avatar": "👍"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (nickname is number)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": 10, "emoji_avatar": "👍"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (nickname is array)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": ["string"], "emoji_avatar": "👍"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and emoji_avatar has wrong type', () => {
      test('returns isValid=false (emoji_avatar is empty string)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "nick", "emoji_avatar": " "}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (emoji_avatar is number)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "nick", "emoji_avatar": 20}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (emoji_avatar is array)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "nick", "emoji_avatar": ["emoji"]}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and emoji_avatar and nickname are null', () => {
      test('returns isValid=false', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": null, "emoji_avatar": null}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and emoji_avatar or nickname are undefined', () => {
      test('returns isValid=false (emoji_avatar undefined)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "nickname"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (nickname undefined)', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "emoji_avatar": "emoji"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and have extra field', () => {
      test('returns isValid=false', () => {
        const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "new nick", "emoji_avatar": "👍", "other_field": "value"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })
  })
})

describe('parseMessage VALID output', () => {
  describe('when input is valid message', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "new nick", "emoji_avatar": "👍"}'
    const result = parseMessage(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.updateProfile)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'update_profile',
        nickname: 'new nick',
        emoji_avatar: '👍'
      })
    })
  })

  describe('when input is valid message (nickname = null)', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": null, "emoji_avatar": "👍"}'
    const result = parseMessage(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.updateProfile)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'update_profile',
        nickname: null,
        emoji_avatar: '👍'
      })
    })
  })

  describe('when input is valid message (emoji_avatar = null)', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "action": "update_profile", "nickname": "new nick", "emoji_avatar": null}'
    const result = parseMessage(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.updateProfile)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'update_profile',
        nickname: 'new nick',
        emoji_avatar: null
      })
    })
  })
})
