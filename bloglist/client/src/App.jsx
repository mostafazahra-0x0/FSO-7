import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useMatch
} from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import BlogForm from './components/BlogForm'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 10px;
`

const Input = styled.input`
  background: Bisque;
  margin: 0.25em;
  padding: 5px;
  border-radius: 5px;
`
const LoginFormDiv = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
    setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    navigate('/')
  }
  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      navigate('/')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(prevBlogs => prevBlogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const loginForm = () => (
    <LoginFormDiv onSubmit={handleLogin}>
      <div>
        <label>
          username
          <Input
            type="text"
            value={username}
            name="username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <Input
            type="password"
            value={password}
            name="password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <Button type="submit">login</Button>
    </LoginFormDiv>
  )
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null
  return (
    <div>
      <NavBar user={user} handleLogout={handleLogout} />

      <Notification message={errorMessage} variant="error" />
      <Notification message={successMessage} variant="success" />

      <Routes>
        <Route path="/login" element={
          user
            ? <p>You are already logged in</p>
            : loginForm()
        } />
        <Route path="/blogs/:id" element={
          <Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
      </Routes>
    </div>
  )
}

export default App