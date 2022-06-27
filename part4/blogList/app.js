require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express() 
require('express-async-errors') // is utilized to handle errors, you don't need to put the try and catch
//utils
const logger= require('./utils/logger.js')
const  config = require('./utils/config.js')
const middleware = require('./utils/middleware.js')
const blogRouter = require('./controllers/blog.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => { logger.info('connected to MongoDB') })
  .catch((error) => { logger.error('error connecting to MongoDB:', error.message) })

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login/', loginRouter)
app.use('/api/blogs/', blogRouter)
app.use('/api/users/', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports= app