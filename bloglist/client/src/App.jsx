import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import BlogForm from './components/BlogForm'
import styled from 'styled-components'
import ErrorBoundary from './components/ErrorBoundary'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

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
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const { data: blogs = [] } = result
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.concat(returnedBlog),
      )
    },
  })
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (returnedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog))
      )
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.filter((b) => b.id !== id)
      )
    }
  })
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject, {
      onSuccess: () => {
        dispatch({
          type: 'SET',
          payload: {
            message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
            variant: 'success',
          },
        })
        setTimeout(() => {
          dispatch({ type: 'CLEAR' })
        }, 5000)
      },
    })
  }
  const handleLogin = async (event) => {
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
      dispatch({
        type: 'SET',
        payload: {
          message: 'Wrong credentials',
          variant: 'error',
        },
      })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/')
  }

  const handleLike = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user,
    }
    likeBlogMutation.mutate({ id: blog.id, blog: updatedBlog })
  }
  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id)
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
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null
  return (
    <div>
      <NavBar user={user} handleLogout={handleLogout} />

      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/login"
            element={user ? <p>You are already logged in</p> : loginForm()}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            }
          />
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
