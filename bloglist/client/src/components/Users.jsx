import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import userService from '../services/users'

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 600px;
`

const Th = styled.th`
  text-align: left;
  padding: 0.7em;
  background: #1a1a2e;
  color: white;
`

const Td = styled.td`
  padding: 0.7em;
  border-bottom: 1px solid #ddd;
`

const Users = () => {
  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const { data: users = [] } = usersResult

  return (
    <div>
      <h2>Users</h2>

      <Table>
        <thead>
          <tr>
            <Th>User</Th>
            <Th>Blogs created</Th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.blogs.length}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users