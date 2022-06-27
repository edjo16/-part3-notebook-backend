const express = require('express')
const blogRouter = express.Router();
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization') 
     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
       return authorization.substring(7)  
      }  
      return null
    }
    
    blogRouter.post('/', async (request, response) => {
        const body = request.body
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {    
          return response.status(401).json({ error: 'token missing or invalid' })  }
        
          const user = await User.findById(decodedToken.id) // analyzed this
        
        const blog = new Blog({ title: body.title, author: body.author, url: body.url, likes: body.likes,
          user: user._id })
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id) // saved th data to the user too
            await user.save()
            response.status(201).json(savedBlog)
    
    })

blogRouter.get('/', async (request, response) => {
    const result = await Blog.find({}).populate('user',{username :1, name: 1})
    response.json(result)
})

blogRouter.get('/:id', async (request, response) => {

      const blogs = await Blog.findById(request.params.id)
      if (blogs) {
        response.json(blogs)
      } else {
        response.status(404).end()
      }
 
  })


blogRouter.delete('/:id',async (req, res, ) => {
          await  Blog.findByIdAndRemove(req.params.id)
            res.status(204).end()
       
})
blogRouter.put('/:id', async (request, response) =>{
    const body= request.body
    const blog ={ title: body.title, author: body.author, url: body.url, likes: body.likes }
   
  const updateBlog= await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
    response.json(updateBlog)

   })
module.exports = blogRouter