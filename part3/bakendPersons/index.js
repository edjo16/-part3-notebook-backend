import app from './app'
import http from 'http'
//utils
import logger from './utils/logger.js'
import config from './utils/config.js'

const server = http.createSever(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})