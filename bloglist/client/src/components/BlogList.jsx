import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import blogService from '../services/blogs'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  max-width: 600px;
`

// List rows echo the card system at lower emphasis: white surface,
// 12px radius, same border/shadow, with a left accent bar in #e94560
// so the ranking order reads as content, not decoration.
const BlogCardLink = styled(Link)`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-left: 4px solid #e94560;
  border-radius: 12px;
  padding: 0.9em 1.2em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #1a1a2e;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #bdbdc9;
    border-left-color: #c73650;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #4361ee;
    outline-offset: 2px;
  }
`

const Title = styled.span`
  font-weight: 600;
  font-size: 1rem;
`

const Author = styled.span`
  color: #e94560;
  font-size: 0.9rem;
`

// Tabular numbers keep like-counts aligned when the list grows.
const Likes = styled.span`
  flex-shrink: 0;
  color: #555;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
`

const BlogList = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const { data: blogs = [] } = result

  return (
    <List>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogCardLink key={blog.id} to={`/blogs/${blog.id}`}>
            <span>
              <Title>{blog.title}</Title> <Author>{blog.author}</Author>
            </span>
            <Likes>
              {blog.likes} {blog.likes === 1 ? 'like' : 'likes'}
            </Likes>
          </BlogCardLink>
        ))}
    </List>
  )
}

export default BlogList
