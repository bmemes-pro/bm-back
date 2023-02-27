/* eslint-disable @typescript-eslint/naming-convention */
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor((Math.random() * array.length))]
}

export const trimedStringOrNull = (m: string | undefined): string | null => {
  if (m === undefined || m === null) {
    return null
  }

  const r = m.trim()

  return r.length > 0 ? r : null
}
