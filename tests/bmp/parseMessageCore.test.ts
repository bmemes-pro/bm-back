import { parseMessageCore } from '../../src/bmp/index'
import { BMPAction, BMPVersion } from '../../src/bmp/types'

const expectedInvalidResult = { isValid: false }

describe('parseMessageCore INVALID output', () => {
  describe('when input is undefined', () => {
    const input = undefined

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input is empty string', () => {
    const input = ' '

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input not have sign', () => {
    const input = '{"bmp": "v23.1", "action": "post"}'

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input have invalid sign', () => {
    const input = '// <|> bmp wrong sign {"bmp": "v23.1", "action": "post"}'

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input not have json', () => {
    const input = '// <|> bmp test '

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input have invalid json', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "ac'

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input is invalid bmp version', () => {
    const input = '// <|> bmp test {"bmp": "v10.1", "action": "post"}'

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input is invalid action', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "action": "invalid"}'

    test('returns isValid=false', () => {
      expect(parseMessageCore(input)).toEqual(expectedInvalidResult)
    })
  })
})

describe('parseMessageCore VALID output', () => {
  describe('when input is valid message (delimiter space)', () => {
    const input = '// <|> bmp test {"bmp": "v23.1", "action": "post"}'
    const result = parseMessageCore(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.post)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'post'
      })
    })
  })

  describe('when input is valid message (delimiter break)', () => {
    const input = '// <|> bmp test\n{"bmp": "v23.1", "action": "post"}'
    const result = parseMessageCore(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.post)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'post'
      })
    })
  })

  describe('when input is valid message (add others field)', () => {
    const input = '// <|> bmp test\n{"bmp": "v23.1", "action": "post", "message": "just message", "img_urls": [], "reply_to": null}'
    const result = parseMessageCore(input)

    test('returns isValid=true', () => {
      expect(result.isValid).toEqual(true)
    })

    test('returns version=v23.1', () => {
      expect(result.version).toEqual(BMPVersion.v23_1)
    })

    test('returns action=post', () => {
      expect(result.action).toEqual(BMPAction.post)
    })

    test('returns bmp object', () => {
      expect(result.object).toEqual({
        bmp: 'v23.1',
        action: 'post',
        message: 'just message',
        img_urls: [],
        reply_to: null
      })
    })
  })
})
