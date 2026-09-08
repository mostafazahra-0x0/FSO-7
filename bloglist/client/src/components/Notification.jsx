import styled from 'styled-components'

const NotificationContainer = styled.div`
  background: ${props => props.$variant === 'error' ? '#f8d7da' : '#d4edda'};
  color: ${props => props.$variant === 'error' ? '#721c24' : '#155724'};
  border: 1px solid ${props => props.$variant === 'error' ? '#f5c6cb' : '#c3e6cb'};
  font-size: 1rem;
  border-radius: 6px;
  padding: 0.8em 1.2em;
  margin-bottom: 1em;
`

const Notification = ({ message, variant }) => {
  if (message === null) {
    return null
  }

  return (
    <NotificationContainer className="notification" $variant={variant}>
      {message}
    </NotificationContainer>
  )
}

export default Notification
