import { Request, Response } from 'express'
import createViewLog from '../../services/viewlog/createViewLog'
import getInfoService from '../../services/getInfo'
import requestIp from 'request-ip'

export const getInfo = (req: Request, res: Response): void => {
  getInfoService().then(info => {
    res.status(200).send(info)
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })
}

export const postInfo = (req: Request, res: Response): void => {
  getInfoService().then(info => {
    res.status(200).send(info)
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })

  const { postId, userAgent, userIp, byFrontend, byShare, byLike } = req.body

  if (postId !== undefined) {
    // it async function
    createViewLog({
      postId: parseInt(postId),
      userAgent: userAgent ?? req.get('User-Agent'),
      userIp: userIp ?? requestIp.getClientIp(req) ?? undefined,
      byFrontend,
      byShare,
      byLike
    }).catch((e) => { console.log(e) }) // TODO e to sentry
  }
}
