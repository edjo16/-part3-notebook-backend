const app = require('./app') // the actual Express app
const http = require('http')
const  config = require('./utils/config.js')
const logger=require('./utils/logger.js')
const express = require('express')

app.use(express.json())

const server= http.createServer(app)

server.listen(config.PORT,()=>{
    logger.info(`Server running on port ${config.PORT}`)
})

