import { useState } from 'react'
import styled from 'styled-components'

// Card + form language matches BlogCard / LoginCard: white, 12px radius,
// 1px #e0e0e0 border + soft shadow.
const Card = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5em 2em;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const Heading = styled.h2`
  margin: 0 0 0.8em;
  font-size: 1.5rem;
  color: #1a1a2e;
`

const Field = styled.div`
  margin-bottom: 0.9em;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a2e;
`

const Input = styled.input`
  font-size: 0.95rem;
  padding: 0.55em 0.9em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a2e;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #888;
    font-weight: 400;
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

// Same primary pill as LikeButton: #e94560 -> #c73650 on hover.
const Button = styled.button`
  background: #e94560;
  color: white;
  font-size: 0.9em;
  font-weight: 600;
  margin-top: 0.4em;
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

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Card>
      <Heading>Create new</Heading>
      <form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="title">
            title
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="write blog title here"
            />
          </Label>
        </Field>
        <Field>
          <Label htmlFor="author">
            author
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="write author name here"
            />
          </Label>
        </Field>
        <Field>
          <Label htmlFor="url">
            url
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="write blog url here"
            />
          </Label>
        </Field>
        <Button type="submit">create</Button>
      </form>
    </Card>
  )
}

export default BlogForm
