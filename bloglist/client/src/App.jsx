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
import User from './components/User'
import styled from 'styled-components'
import ErrorBoundary from './components/ErrorBoundary'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import persistentUser from './services/persistentUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useField from './hooks/useField'
// Primary action: solid #e94560 pill, darkens to #c73650 on hover —
// the same interaction language as LikeButton in Blog.jsx.
const Button = styled.button`
  background: #e94560;
  color: white;
  font-size: 0.9em;
  font-weight: 600;
  margin: 1em 0 0;
  padding: 0.55em 1.4em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c73650;
  }

  &:focus-visible {
    outline: 2px solid #1a1a2e;
    outline-offset: 2px;
  }
`

const Input = styled.input`
  font-size: 0.95rem;
  margin: 0.25em;
  padding: 0.55em 0.9em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a2e;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #888;
  }

  &:hover {
    border-color: #bdbdc9;
  }

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.18);
  }
`

// Centers the app column and caps line length for readability.
const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.2em 3em;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  color: #1a1a2e;
`

const LoginCard = styled.form`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5em 2em;
  max-width: 420px;
  margin: 2em auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a2e;
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
    <LoginCard onSubmit={handleLogin}>
      <FieldLabel htmlFor="username">
        username
        <Input
          type={username.type}
          value={username.value}
          onChange={username.onChange}
          name="username"
          id="username"
        />
      </FieldLabel>
      <FieldLabel htmlFor="password">
        password
        <Input
          type={password.type}
          value={password.value}
          onChange={password.onChange}
          name="password"
          id="password"
        />
      </FieldLabel>
      <Button type="submit">login</Button>
    </LoginCard>
  )
  return (
    <Page>
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
          <Route path="/users/:id" element={<User />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </ErrorBoundary>
    </Page>
  )
}

export default App
