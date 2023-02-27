/* eslint-disable @typescript-eslint/naming-convention */
import { BMPAction, BMPVersion } from './types'
import { trimedStringOrNull } from './utils'
import { BMP_SIGNS } from './const'

interface Output {
  isValid: boolean
  version?: string
  action?: BMPAction
  object?: any
}

const isValidField = (enumObject: Record<string, BMPVersion | BMPAction>, field: any): boolean => {
  if (typeof field !== 'string') {
    return false
  }

  const enumValues = Object.values(enumObject) as string[]
  return enumValues.includes(field)
}

export default (_input?: string): Output => {
  const input = trimedStringOrNull(_input)

  if (typeof input !== 'string') {
    return {
      isValid: false
    }
  }

  let haveSign = false
  let clearedInput = ''

  for (const itemSign of BMP_SIGNS) {
    if (input.slice(0, itemSign.length) === itemSign) {
      haveSign = true
      clearedInput = input.replace(itemSign, '').trim()
      break
    }
  }

  if (!haveSign || clearedInput.length === 0) {
    return {
      isValid: false
    }
  }

  let candidateMessage: any = {}

  try {
    candidateMessage = JSON.parse(clearedInput)
  } catch (e) {
    return {
      isValid: false
    }
  }

  const version = candidateMessage.bmp
  const action = candidateMessage.action

  if (!isValidField(BMPVersion, version)) {
    return {
      isValid: false
    }
  }

  if (!isValidField(BMPAction, action)) {
    return {
      isValid: false
    }
  }

  return {
    isValid: true,
    version,
    action,
    object: candidateMessage
  }
}
