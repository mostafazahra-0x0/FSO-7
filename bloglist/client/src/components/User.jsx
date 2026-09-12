import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import userService from '../services/users'

// Same card language as BlogCard / Users card for consistency.
const Card = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5em 2em;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const Heading = styled.h2`
  margin: 0 0 0.2em;
  font-size: 1.5rem;
  color: #1a1a2e;
`

const SubHeading = styled.h3`
  margin: 1.2em 0 0.6em;
  font-size: 1.1rem;
  color: #1a1a2e;
  border-top: 1px solid #e0e0e0;
  padding-top: 1em;
`

const BlogList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const BlogItem = styled.li`
  background: #f6f6f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6em 0.9em;
  font-size: 0.95rem;
  color: #333;
`

const BlogLink = styled(Link)`
  color: #4361ee;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #4361ee;
    outline-offset: 2px;
    border-radius: 4px;
  }
`

// #555 instead of #888: small muted text needs ~4.5:1 on white.
const Muted = styled.p`
  color: #555;
  font-size: 0.85rem;
  margin: 0.4em 0 0;
`

const User = () => {
  const { id } = useParams()

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const users = result.data || []
  const user = users.find((user) => user.id === id)

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <Card>
      <Heading>{user.name}</Heading>
      <Muted>
        {user.blogs.length === 0
          ? 'No blogs yet'
          : `${user.blogs.length} ${user.blogs.length === 1 ? 'blog' : 'blogs'} published`}
      </Muted>

      <SubHeading>Added blogs</SubHeading>

      {user.blogs.length === 0 ? (
        <Muted>This user has not added any blogs yet.</Muted>
      ) : (
        <BlogList>
          {user.blogs.map((blog) => (
            <BlogItem key={blog.id}>
              {blog.id ? (
                <BlogLink to={`/blogs/${blog.id}`}>{blog.title}</BlogLink>
              ) : (
                blog.title
              )}
            </BlogItem>
          ))}
        </BlogList>
      )}
    </Card>
  )
}

export default User
