import { In } from 'typeorm'
import { ViewLog } from '../db/entities/ViewLog'
import { dataSource } from '../db'
import isSharingUserAgent from '../services/viewlog/isSharingUserAgent'
import isbot from 'isbot'

const logsRepo = dataSource.getRepository(ViewLog)

export default async (): Promise<void> => {
  const allLogs = await logsRepo.find()
  console.log('total', allLogs.length)

  const botLogs = allLogs.filter((log) => isbot(log.user_agent))
  const sharingLogs = allLogs.filter((log) => isSharingUserAgent(log.user_agent))

  console.log('bot', botLogs.length)
  console.log('sharing', sharingLogs.length)

  const botLogsLogsIds = botLogs.map(log => log.id)
  const sharingLogsIds = sharingLogs.map(log => log.id)

  console.log(botLogsLogsIds)
  console.log(sharingLogsIds)

  await logsRepo.update(
    {
      id: In(botLogsLogsIds)
    },
    { is_bot_user_agent: true }
  )

  await logsRepo.update(
    {
      id: In(sharingLogsIds)
    },
    { is_sharing_user_agent: true }
  )
}
