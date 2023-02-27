import { promisify } from 'util'
import uploadFile from './s3/uploadFile'
import sharp from 'sharp'
import fs from 'fs'
import fileTypeDetect from 'detect-file-type'

interface Input {
  fileBody: Buffer
  savePreview?: boolean
}

const PREVIEW_WIDTH = 500
export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif']

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const typeDetectFromBuffer = promisify(fileTypeDetect.fromBuffer)

const generateFilename = (ext: string): string => {
  const date = new Date().toISOString().replace(/-/g, '').substring(2, 8)
  const randomKey = Math.random().toString(36).substring(2, 8)
  return `${date}${randomKey}.${ext}`
}

const compressAndSaveImage = async (fileBody: Buffer, fileName: string): Promise<string> => {
  const previewName = fileName.replace(/\.(.{2,5})$/, '_prw.$1') // .ext -> _prew.ext

  await sharp(fileBody, { animated: true })
    .resize(PREVIEW_WIDTH)
    .toFile(previewName)

  const previewFileInfo = fs.statSync(previewName)

  if (Buffer.byteLength(fileBody) < previewFileInfo.size) {
    await writeFile(previewName, fileBody, 'binary')
  }

  return previewName
}

const uploadImage = async ({ fileBody, savePreview = true }: Input): Promise<string> => {
  const fileInfo = await typeDetectFromBuffer(fileBody)

  if (!IMAGE_MIME_TYPES.includes(fileInfo.mime) || fileInfo.ext === undefined) {
    throw new Error('You should upload only images')
  }

  const fileName = generateFilename(fileInfo.ext)

  const origUrl = await uploadFile({
    fileBody,
    fileName,
    mimeType: fileInfo.mime
  })

  if (savePreview) {
    const previewName = await compressAndSaveImage(fileBody, fileName)
    const previewFileBody = await readFile(previewName)

    await uploadFile({
      fileBody: previewFileBody,
      fileName: previewName,
      mimeType: fileInfo.mime
    })

    fs.rmSync(previewName)
  }

  return origUrl
}

export default uploadImage
