import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3'
import axios from 'axios'
import * as stream from 'stream'
import { promisify } from 'util'
import configuration from '../config'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import uploadFile from '../services/s3/uploadFile'
import fileTypeDetect from 'detect-file-type'

const finished = promisify(stream.finished)
const copyFile = promisify(fs.copyFile)
const readFile = promisify(fs.readFile)
const typeDetectFromBuffer = promisify(fileTypeDetect.fromBuffer)
const { s3 } = configuration
const PREVIEW_WIDTH = 500

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: s3.endpoint,
  region: s3.region,
  credentials: {
    accessKeyId: s3.accessKeyId,
    secretAccessKey: s3.accessKeySecret
  }
})

async function downloadFile (fileUrl: string, outputLocationPath: string): Promise<any> {
  const writer = fs.createWriteStream(outputLocationPath)
  return await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  }).then(async response => {
    response.data.pipe(writer)
    return await finished(writer) // this is a Promise
  })
}

const compressImage = async (path: string): Promise<string> => {
  const previewPath = path.replace(/\.(.{2,5})$/, '_prw.$1') // .ext -> _prew.ext

  await sharp(path, { animated: true })
    .resize(PREVIEW_WIDTH)
    .toFile(previewPath)

  const origFileInfo = fs.statSync(path)
  const previewFileInfo = fs.statSync(previewPath)

  if (origFileInfo.size < previewFileInfo.size) {
    await copyFile(path, previewPath)
  }

  return previewPath
}

export default async (): Promise<void> => {
  const command = new ListObjectsCommand({ Bucket: s3.bucket })

  const response = await s3Client.send(command)

  if (response.Contents === undefined) {
    return
  }

  const filesInfo = response.Contents.reverse()
  // const filesInfo = response.Contents.slice(0, 5)

  for (const fileInfo of filesInfo) {
    if (typeof fileInfo.Key === 'string' && fileInfo.Key.includes('_prw')) {
      continue
    }

    const fileLink = `${s3.endpoint}/${s3.bucket}/${fileInfo.Key as string}`
    await downloadFile(fileLink, fileInfo.Key as string)

    try {
      const previewPath = await compressImage(fileInfo.Key as string)
      const previewFileBuffer = await readFile(previewPath)

      const { mime } = await typeDetectFromBuffer(previewFileBuffer)

      const newFilePath = await uploadFile({
        fileBody: previewFileBuffer,
        fileName: path.basename(previewPath),
        mimeType: mime
      })

      console.log('upload prw: ', newFilePath)
    } catch (e) {
      console.log('some error: ', e)
    }
  }
}
