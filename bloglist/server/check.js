require('dotenv').config()
const mongoose = require('mongoose')
const Blog = require('./models/blog')

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const count = await Blog.countDocuments({})
  console.log('REAL COUNT:', count)
  mongoose.connection.close()
})
