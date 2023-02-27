import { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import uploadImageService, { IMAGE_MIME_TYPES } from '../../services/uploadImage'
import configuration from '../../config'
import Sentry from '../../config/sentry'

const { s3 } = configuration

const correctImageUrl = (url: string): string => {
  return url.replace(`${s3.endpoint}/${s3.bucket}/${s3.memesFolder}`, `${configuration.apiServer.origin}/imgs`)
}

export const getImage = (req: Request, res: Response): void => {
  const name = req.params.name
  const { preview } = req.query
  const imageName = preview === 'true' ? name.replace(/\.(.{2,5})$/, '_prw.$1') : name // .ext -> _prew.ext (if preview)

  res.redirect(`${s3.endpoint}/${s3.bucket}/${s3.memesFolder}/${imageName}`)
}

export const uploadImage = (req: Request, res: Response): void => {
  if (req.files == null) {
    res.status(400).send('No files were uploaded.')
    return
  }

  const fileData: fileUpload.UploadedFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image

  if (!IMAGE_MIME_TYPES.includes(fileData.mimetype)) {
    res.status(400).send('You should upload only images')
    return
  }

  uploadImageService({ fileBody: fileData.data }).then(url => {
    res.status(200).send({ url: correctImageUrl(url) })
  }).catch(e => {
    res.status(500).send('x__x')
    Sentry.captureException((e ?? 'undefined error'))
  })
}
