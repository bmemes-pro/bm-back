import express from 'express'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import { uploadImage, getImage } from './controllers/imagesController'
import { list as listPosts, show as showPost } from './controllers/postsController'
import { list as listUsers, show as showUser } from './controllers/usersController'
import { getInfo, postInfo } from './controllers/infoController'
import configuration from '../config'
import logger from '../config/logger'
import metrics from 'express-status-monitor'

const initialize = async (): Promise<void> => {
  const app = express()
  app.use(metrics({ path: '/api/supersecretmonitoring' }))

  // parse files
  app.use(fileUpload())
  // parse application/json
  app.use(bodyParser.json())

  // images
  app.post('/api/images', uploadImage)
  app.get('/imgs/:name', getImage)

  // posts
  app.get('/api/posts', listPosts)
  app.get('/api/post/:id', showPost)

  // users
  app.get('/api/users', listUsers)
  app.get('/api/user/:id', showUser)

  // info
  app.get('/api/info', getInfo)
  app.post('/api/info', postInfo)

  // start server
  app.listen(configuration.apiServer.port)
  logger.info('APIServer initializing DONE')
}

export default initialize
