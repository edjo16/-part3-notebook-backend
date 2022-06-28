const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app.js')
const api = supertest(app)
const Blog = require('../models/blog.js')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => { 
   await Blog.deleteMany({})  
  const blogObjects = helper.initialBlogs
  .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save()) 
  await Promise.all(promiseArray)  
  })

describe('blogs', ()=>{
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', "application/json; charset=utf-8")
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
    expect(contents).toContain(    'Avatar'  )
  })

    test('blog without content is not added', async () => {
      const newBlog = {
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
    
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]      
  const resultBlog = await api    
  .get(`/api/blogs/${blogToView.id}`)   
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const processedblogToView = JSON.parse(JSON.stringify(blogToView))
  expect(resultBlog.body).toEqual(processedblogToView)
  
})

test('a blog can be deleted', async (req) => {
  const token = req.token
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api 
  .delete(`/api/blogs/${blogToDelete.id}`)
  .set('Authorization', token) 
    .expect(204)
  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})


test('identifitor is called id not _id', async()=>{
  const response = await api.get('/api/blogs')
  const content = response.body.map(item => item.id)
  expect(content).toBeDefined()
})

test('se crea nuevo post', async()=>{
  const newPost ={
title:"Stranger Things",
author:" the strangers brothers",
url:"strange.com",
likes:10
  }

  await api.post('/api/blogs').send(newPost)
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

test('likes is 0 by default', async()=>{
  const newBlog={
    "author": "Julius thompson",
     "title": "Euphoria",
     "url": "euphoria.com"}
     
  const response= await api.post('/api/blogs').send(newBlog)
  expect(response.body.likes).toBe(0)
})

test('propertys title and url are integrated', async()=>{
  const newPost ={
title:"Stranger Things",
author:" the strangers brothers",
url:"strange.com",
likes:10
  }

  await api.post('/api/blogs').send(newPost)
  const response = await api.get('/api/blogs')
  expect(response.body.title).toBeDefined()
  expect(response.body.url).toBeDefined()
})
})


//... users test

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const token =request => {
      const authorization = request.get('authorization') 
       if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
         return authorization.substring(7)  
        }  
        return null
      }
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .set({ Authorization: token })
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})




afterAll(() => {
  mongoose.connection.close()
})