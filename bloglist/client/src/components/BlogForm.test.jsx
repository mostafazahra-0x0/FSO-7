import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write author name here')
  const urlInput = screen.getByPlaceholderText('write blog url here')

  await user.type(titleInput, 'Testing forms')
  await user.type(authorInput, 'Kent C. Dodds')
  await user.type(urlInput, 'https://example.com')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Kent C. Dodds',
    url: 'https://example.com'
  })
})