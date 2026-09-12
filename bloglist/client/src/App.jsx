import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import styled from 'styled-components'
import ErrorBoundary from './components/ErrorBoundary'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import persistentUser from './services/persistentUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useField from './hooks/useField'
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
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const username = useField('text')
  const password = useField('password')
  const navigate = useNavigate()
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })
  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })
  useEffect(() => {
    const user = persistentUser.getUser()
    if (user) {
      userDispatch({ type: 'SET', payload: user })
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
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      })
      blogService.setToken(user.token)
      userDispatch({ type: 'SET', payload: user })
      persistentUser.saveUser(user)
      navigate('/')
      username.reset()
      password.reset()
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
    persistentUser.removeUser()
    userDispatch({ type: 'CLEAR' })
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
            type={username.type}
            value={username.value}
            onChange={username.onChange}
            name="username"
            id="username"
          />
        </label>
      </div>
      <div>
        <label>
          password
          <Input
            type={password.type}
            value={password.value}
            onChange={password.onChange}
            name="password"
            id="password"
          />
        </label>
      </div>
      <Button type="submit">login</Button>
    </LoginFormDiv>
  )
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
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            }
          />
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
