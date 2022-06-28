const express = require('express')
const blogRouter = express.Router();
const Blog = require('../models/blog.js')


    blogRouter.post('/', async (request, response) => {
        const body = request.body
        if (body.title && body.url) {
          const token = request.token;    
          if (!token) {
            return response.status(401).json({ error: 'invalid token' });
          }
          if(!request.user){
            return response.status(401).json({ error: 'invalid user' });
          }
           const user = request.user
        
        const blog = new Blog({ title: body.title, author: body.author, url: body.url, likes: body.likes,
          user: user._id })

            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id) // saved th data to the user too
            await user.save()
            response.status(201).json(savedBlog)
        }
        response.status(400).end();
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
  const token = req.token

  if (!token) {    
    return res.status(401).json({ error: 'token missing or invalid' }) 
   }
          await  Blog.findByIdAndRemove(req.params.id)
            res.status(204).end()       
})

blogRouter.put('/:id', async (req, res) =>{
    const body= req.body
    const token = req.token

    if (!token) {  
      return res.status(401).json({ error: 'token missing or invalid' }) 
   }
    const blog ={ title: body.title, author: body.author, url: body.url, likes: body.likes }
   
  const updateBlog= await Blog.findByIdAndUpdate(req.params.id, blog, {new:true})
    res.json(updateBlog)

   })
module.exports = blogRouter