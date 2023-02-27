import processMessages from '../services/sync/processMessages'

export default async (): Promise<void> => {
  await processMessages()
}
