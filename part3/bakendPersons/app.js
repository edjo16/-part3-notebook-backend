const app= express()
import 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import express from 'express'

//utils
import logger from './utils/logger.js'
import config from './utils/config.js'
import middleware from './utils/middleware'
import personRouter from './controllers/person'

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => { logger.info('connected to MongoDB') })
  .catch((error) => { logger.error('error connecting to MongoDB:', error.message) })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/people/', personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app