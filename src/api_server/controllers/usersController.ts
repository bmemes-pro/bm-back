import { Request, Response } from 'express'
import userIndex from '../../services/users/userIndex'
import userShow from '../../services/users/userShow'

export const list = (req: Request, res: Response): void => {
  userIndex(req.query).then(users => {
    res.status(200).send(users)
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })
}

export const show = (req: Request, res: Response): void => {
  const id = req.params.id

  userShow({ id }).then(user => {
    if (user !== null) {
      res.status(200).send(user)
    } else {
      res.status(404).send('Not found')
    }
  }).catch(e => {
    res.status(400).json({ error: e.message })
  })
}
