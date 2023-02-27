import { Request, Response } from 'express'
import postIndex from '../../services/posts/postIndex'
import postShow from '../../services/posts/postShow'
import createViewLog from '../../services/viewlog/createViewLog'
import requestIp from 'request-ip'

export const list = (req: Request, res: Response): void => {
  postIndex(req.query).then(posts => {
    res.status(200).send(posts)
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })
}

export const show = (req: Request, res: Response): void => {
  const id = req.params.id

  postShow({ id }).then(post => {
    if (post !== null) {
      res.status(200).send(post)

      // it async function
      createViewLog({
        postId: parseInt(id),
        userAgent: req.get('User-Agent'),
        userIp: requestIp.getClientIp(req) ?? undefined,
        byApi: true
      }).catch(() => {})
    } else {
      res.status(404).send('Not found')
    }
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })
}
