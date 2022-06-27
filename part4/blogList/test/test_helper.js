const Blog = require('../models/blog')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}
const initialBlogs = [{
    title: "La ROCA",
    author: "Rock jhonson",
    url: "mercy.com",
    likes: 10,
  },{
    title: "Avatar",
    author: "James Cameron",
    url: "jamescameron.com",
    likes: 14,
  }]
const nonExistingId = async () => {
  const blog = new Blog({ title: 'avatar', date: new Date() })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}