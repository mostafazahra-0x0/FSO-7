import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://example.com/blog',
  likes: 5,
  user: { username: 'kentcdodds', name: 'Kent C. Dodds' }
}

test('renders blog info and likes to unauthenticated users, without buttons', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={null} />)

  expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
  expect(screen.getAllByText(blog.author, { exact: false }).length).toBeGreaterThan(0)
  expect(screen.getByText('likes 5', { exact: false })).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})
test('shows only the like button to a logged-in user who is not the creator', () => {
  const loggedInUser = { username: 'someoneelse', name: 'Someone Else' }

  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={loggedInUser} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test("shows the delete button to the blog's creator", () => {
  const creatorUser = { username: 'kentcdodds', name: 'Kent C. Dodds' }

  render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} user={creatorUser} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

test('like button calls handleLike once per click', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()
  const creatorUser = { username: 'kentcdodds', name: 'Kent C. Dodds' }

  render(<Blog blog={blog} handleLike={mockHandler} handleDelete={() => {}} user={creatorUser} />)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})