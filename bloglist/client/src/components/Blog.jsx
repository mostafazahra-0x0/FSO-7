import styled from 'styled-components'

const BlogCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5em 2em;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const Title = styled.h2`
  margin: 0 0 0.3em;
  font-size: 1.5rem;
  color: #1a1a2e;
`

const Author = styled.span`
  color: #e94560;
`

const Url = styled.a`
  display: block;
  color: #4361ee;
  text-decoration: none;
  margin-bottom: 1em;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`

const LikesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin-bottom: 0.5em;
  font-size: 1rem;
  color: #333;
`

const LikeButton = styled.button`
  background: #e94560;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.3em 1em;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c73650;
  }
`

const AddedBy = styled.div`
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 1em;
`

const RemoveButton = styled.button`
  background: transparent;
  color: #e94560;
  border: 1px solid #e94560;
  border-radius: 6px;
  padding: 0.3em 0.9em;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: #e94560;
    color: white;
  }
`

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) {
    return null
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <BlogCard className='blog'>
      <Title>{blog.title} <Author>{blog.author}</Author></Title>
      <Url href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</Url>
      <LikesRow>
        <span>likes {blog.likes}</span>
        {user &&
          <LikeButton onClick={() => handleLike(blog)}>like</LikeButton>
        }
      </LikesRow>
      <AddedBy>added by {blog.user && blog.user.name}</AddedBy>
      {showDeleteButton &&
        <RemoveButton onClick={() => handleDelete(blog)}>remove</RemoveButton>
      }
    </BlogCard>
  )
}

export default Blog
