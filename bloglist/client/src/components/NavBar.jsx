import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavBarContainer = styled.nav`
  background: #1a1a2e;
  padding: 0.7em 1.5em;
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-bottom: 1em;
  border-radius: 8px;
`

const NavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`

const Brand = styled(Link)`
  color: #e94560;
  font-weight: bold;
  font-size: 1.3rem;
  text-decoration: none;
  margin-right: 1em;
`

const Spacer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1em;
`

const UserName = styled.span`
  color: #a0a0c0;
  font-size: 0.9rem;
`

const LogoutButton = styled.button`
  background: transparent;
  color: #e94560;
  border: 1px solid #e94560;
  border-radius: 4px;
  padding: 0.3em 0.8em;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background: #e94560;
    color: white;
  }
`

const NavBar = ({ user, handleLogout }) => {
  return (
    <NavBarContainer>
      <Brand to="/">BlogApp</Brand>
      <NavLink to="/">blogs</NavLink>
      {user === null ? (
        <NavLink to="/login">login</NavLink>
      ) : (
        <>
          <NavLink to="/create">create new</NavLink>
          <Spacer>
            <UserName>{user.name} logged in</UserName>
            <LogoutButton onClick={handleLogout}>logout</LogoutButton>
          </Spacer>
        </>
      )}
    </NavBarContainer>
  )
}

export default NavBar
