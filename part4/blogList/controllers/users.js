const express = require('express')
const usersRouter = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const result = await User.find({}).populate('blogs')
    response.json(result)
})

usersRouter.get('/:id', async (request, response) => {
    const result = await User.findById(request.params.id)
    response.json(result)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const res = await user.save()
    response.json(res)
})

usersRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
})


usersRouter.put('/:id', async (request, response) => {
    const body = request.body
    const user = {
        username: body.username,
        name: body.name,
        passwordHash: body.passwordHash,
        blogs: [body.blogs]
    }
    const res = await User.findByIdAndUpdate(request.params.id, user, {new:true})
    response.json(res)
})

module.exports=  usersRouter




