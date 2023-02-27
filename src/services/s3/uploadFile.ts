import { S3Client, PutObjectCommand, ObjectCannedACL, PutObjectCommandInput } from '@aws-sdk/client-s3'
import configuration from '../../config'
import logger from '../../config/logger'

const { s3 } = configuration

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: s3.endpoint,
  region: s3.region,
  credentials: {
    accessKeyId: s3.accessKeyId,
    secretAccessKey: s3.accessKeySecret
  }
})

interface Input {
  fileBody: Buffer
  fileName: string
  mimeType: string
}

const uploadFile = async ({ fileBody, fileName, mimeType }: Input): Promise<string> => {
  const fileKey = `${s3.memesFolder}/${fileName}`

  const params: PutObjectCommandInput = {
    Bucket: s3.bucket,
    Key: fileKey,
    Body: fileBody,
    ACL: ObjectCannedACL.public_read,
    ContentDisposition: 'inline',
    ContentType: mimeType
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  logger.info('File uploaded: ' + fileKey)

  return `${s3.endpoint}/${s3.bucket}/${fileKey}`
}

export default uploadFile
