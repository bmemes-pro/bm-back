
interface Output {
  income?: number
  expense?: number
  hash: string
  utime: Date
  logicalTime: string
  body: any
  message?: string
  peerAddress: string
}

export const trimedStringOrUndefined = (m: string | undefined): string | undefined => {
  if (m === undefined || m === null) {
    return undefined
  }

  const r = m.trim()

  return r.length > 0 ? r : undefined
}

const parseIncome = (rawTransaction: any): number | undefined => {
  const value = parseInt(rawTransaction?.in_msg?.value) ?? undefined
  return value === 0 ? undefined : value
}

const parseExpense = (rawTransaction: any): number | undefined => {
  if (rawTransaction?.out_msgs !== undefined) {
    const { out_msgs: outMsgs } = rawTransaction

    if (Array.isArray(outMsgs) && outMsgs.length > 0) {
      return parseInt(outMsgs[0]?.value) ?? undefined
    }
  }

  return undefined
}

const isInternalTransaction = (rawTransaction: any): boolean => {
  const { in_msg: inMsg, out_msgs: outMsgs } = rawTransaction

  if (outMsgs.length > 0) {
    return false
  }

  if (inMsg !== undefined && typeof inMsg.source === 'string' && inMsg.source.length > 0) {
    return false
  }

  return true
}

const parsePeerAddress = (rawTransaction: any): string => {
  const { in_msg: inMsg, out_msgs: outMsgs } = rawTransaction

  if (inMsg !== undefined && typeof inMsg.source === 'string' && inMsg.source.length > 0) {
    return inMsg.source
  }

  const outMsg = outMsgs[0]

  return outMsg.destination
}

const parseMessage = (rawTransaction: any): string | undefined => {
  const income = parseIncome(rawTransaction)
  const { in_msg: inMsg, out_msgs: outMsgs } = rawTransaction

  if (income !== undefined) {
    const message = inMsg?.message?.trim()

    return message.length > 0 ? message : undefined
  }
  if (Array.isArray(outMsgs) && outMsgs.length > 0) {
    return outMsgs[0]?.message
  }

  return undefined
}

export const parseRawTransaction = (rawTransaction: any): Output | null => {
  if (isInternalTransaction(rawTransaction)) {
    return null
  }

  const { transaction_id: transactionId, utime } = rawTransaction
  const income = parseIncome(rawTransaction)
  const expense = parseExpense(rawTransaction)
  const peerAddress = parsePeerAddress(rawTransaction)
  const message = parseMessage(rawTransaction)
  const hash = transactionId.hash

  const result: Output = {
    income,
    expense,
    hash,
    peerAddress,
    utime: new Date(utime * 1000),
    logicalTime: transactionId.lt,
    body: rawTransaction,
    message: trimedStringOrUndefined(message)
  }

  return result
}

export default parseRawTransaction
