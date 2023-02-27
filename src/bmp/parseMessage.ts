/* eslint-disable @typescript-eslint/naming-convention */
import { BMPPostMessage, BMPUpdateProfileMessage, BMPAction } from './types'
import parseMessageCore from './parseMessageCore'
import checkPostAction from './checkPostAction'
import checkUpdateProfileAction from './checkUpdateProfileAction'

interface Output {
  isValid: boolean
  version?: string
  action?: BMPAction
  object?: BMPPostMessage | BMPUpdateProfileMessage
}

export default (input?: string): Output => {
  const coreResult = parseMessageCore(input)

  if (!coreResult.isValid) {
    return { isValid: false }
  }

  const { version, action, object } = coreResult

  if (action !== BMPAction.post && action !== BMPAction.updateProfile) {
    return { isValid: false }
  }

  if (action === BMPAction.post && !checkPostAction(object)) {
    return { isValid: false }
  }

  if (action === BMPAction.updateProfile && !checkUpdateProfileAction(object)) {
    return { isValid: false }
  }

  return {
    isValid: true,
    version,
    action,
    object
  }
}
