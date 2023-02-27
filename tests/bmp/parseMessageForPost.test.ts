/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { parseMessage } from '../../src/bmp/index'
import { BMPAction, BMPVersion } from '../../src/bmp/types'

const expectedInvalidResult = { isValid: false }

interface BuildInputParams {
  version?: any
  action?: any
  tags?: any
  img_urls?: any
  message?: any
  reply_to?: any
}

const buildInput = ({
  version = 'v23.1',
  action = 'post',
  tags = [],
  img_urls = [],
  reply_to = null,
  message = null
}: BuildInputParams): string => {
  const result = `// <|> bmp test {"bmp":"${version}","action":"${action}","tags":${JSON.stringify(tags)},"img_urls":${JSON.stringify(img_urls)},"reply_to":${reply_to},"message":${message}}`
  // console.log(result)
  return result
}

describe('parseMessage INVALID output', () => {
  describe('when input is empty string', () => {
    const input = ''

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when input is empty obj ({})', () => {
    const input = '{}'

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when wrong signature', () => {
    const input = '// <|> WRONG SIGN {"bmp":"v23.1","action":"post","tags":["a", "b"],"img_urls":["http://"],"reply_to":"hash","message":"some message"}'

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when wrong version', () => {
    const input = buildInput({ version: '123' })

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when wrong action', () => {
    const input = buildInput({ action: 'some dummy action' })

    test('returns isValid=false', () => {
      expect(parseMessage(input)).toEqual(expectedInvalidResult)
    })
  })

  describe('when action = post', () => {
    describe('and img_urls has wrong type', () => {
      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ img_urls: 123 }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ img_urls: '' }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ img_urls: [1] }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (img_url is empty sreing)', () => {
        expect(parseMessage(buildInput({ img_urls: [''] }))).toEqual(expectedInvalidResult)
      })
    })

    describe('and message has wrong type', () => {
      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ message: '[]' }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ message: 1 }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (message string but empty)', () => {
        expect(parseMessage(buildInput({ message: '"   "' }))).toEqual(expectedInvalidResult)
      })
    })

    describe('and tags has wrong type', () => {
      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ tags: '' }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ tags: 1 }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ tags: [1] }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (tag is empty string)', () => {
        const input = buildInput({ tags: [''] })
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and reply_to has wrong type', () => {
      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ reply_to: 2 }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ reply_to: [] }))).toEqual(expectedInvalidResult)
      })

      test('returns isValid=false (reply_to is empty string)', () => {
        const input = buildInput({ reply_to: '""' })
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and some params are missing (message)', () => {
      const input = '// <|> bmp test {"bmp":"v23.1","action":"post","tags":[],"img_urls": [],"reply_to": null}'

      test('returns isValid=false', () => {
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and some params are missing (reply_to)', () => {
      const input = '// <|> bmp test {"bmp":"v23.1","action":"post","tags":[],"img_urls": [],"message": null}'

      test('returns isValid=false', () => {
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and some params are missing (img_urls)', () => {
      const input = '// <|> bmp test {"bmp":"v23.1","action":"post","tags":[],"reply_to": null,"message": null}'

      test('returns isValid=false', () => {
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and some params are missing (tags)', () => {
      const input = '// <|> bmp test {"bmp":"v23.1","action":"post","img_urls":[],"reply_to": null,"message": null}'

      test('returns isValid=false', () => {
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })

    describe('and message and img_urls is empty', () => {
      test('returns isValid=false', () => {
        expect(parseMessage(buildInput({ img_urls: [], message: null }))).toEqual(expectedInvalidResult)
      })
    })

    describe('and have extra field', () => {
      test('returns isValid=false', () => {
        const input = '// <|> bmp test {"bmp":"v23.1","action":"post","tags":["a", "b"],"img_urls":["http://"],"reply_to":"hash","message":"some message", "extra_field": "value"}'
        expect(parseMessage(input)).toEqual(expectedInvalidResult)
      })
    })
  })
})

describe('parseMessage VALID output', () => {
  describe('when action = post', () => {
    describe('check buildInput() method', () => {
      const input = buildInput({ message: '"text"' })
      const result = parseMessage(input)

      test('returns isValid=true', () => {
        expect(result.isValid).toEqual(true)
      })

      test('returns version=v23.1', () => {
        expect(result.version).toEqual(BMPVersion.v23_1)
      })

      test('returns action=post', () => {
        expect(result.action).toEqual(BMPAction.post)
      })

      test('returns valid BMP Message', () => {
        expect(result.object).toEqual({
          action: BMPAction.post,
          bmp: BMPVersion.v23_1,
          img_urls: [],
          message: 'text',
          reply_to: null,
          tags: []
        })
      })
    })

    describe('and input is valid', () => {
      const input = '// <|> bmp test {"bmp":"v23.1","action":"post","tags":["a", "b"],"img_urls":["http://"],"reply_to":"hash","message":"some message"}'
      const result = parseMessage(input)

      test('returns isValid=true', () => {
        expect(result.isValid).toEqual(true)
      })

      test('returns version=v23.1', () => {
        expect(result.version).toEqual(BMPVersion.v23_1)
      })

      test('returns action=post', () => {
        expect(result.action).toEqual(BMPAction.post)
      })

      test('returns valid BMP Message', () => {
        expect(result.object).toEqual({
          action: BMPAction.post,
          bmp: BMPVersion.v23_1,
          img_urls: ['http://'],
          message: 'some message',
          reply_to: 'hash',
          tags: ['a', 'b']
        })
      })
    })
  })
})
