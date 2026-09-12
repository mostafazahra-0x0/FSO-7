import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import userService from '../services/users'
import { Link } from 'react-router-dom'

// Card wrapper reuses the BlogCard convention: white, 12px radius,
// 1px #e0e0e0 border + soft 0 2px 8px shadow.
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

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`

const Th = styled.th`
  text-align: left;
  padding: 0.7em 0.9em;
  background: #1a1a2e;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`

const Td = styled.td`
  padding: 0.7em 0.9em;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-size: 0.95rem;
`

// Row hover gives affordance without new colors; last row drops
// its divider so the table ends cleanly inside the card.
const Tr = styled.tr`
  transition: background 0.2s;

  &:hover {
    background: #f6f6f9;
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`

const UserLink = styled(Link)`
  color: #4361ee;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #4361ee;
    outline-offset: 2px;
    border-radius: 4px;
  }
`

const Users = () => {
  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const { data: users = [] } = usersResult

  return (
    <Card>
      <Heading>Users</Heading>

      <Table>
        <thead>
          <Tr>
            <Th scope="col">User</Th>
            <Th scope="col">Blogs created</Th>
          </Tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                <UserLink to={`/users/${user.id}`}>
                  {user.name}
                </UserLink>
              </Td>
              <Td>{user.blogs.length}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  )
}

export default Users
