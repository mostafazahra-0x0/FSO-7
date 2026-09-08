import { useState } from 'react'
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
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title:
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='write blog title here'
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder='write author name here'
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='write blog url here'
          />
        </label>
      </div>
      <Button type="submit">create</Button>
    </form>
  )
}

export default BlogForm