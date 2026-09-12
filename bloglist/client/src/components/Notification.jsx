import styled from 'styled-components'
import { useNotificationValue } from '../contexts/NotificationContext'
const NotificationContainer = styled.div`
  background: ${(props) => (props.$variant === 'error' ? '#f8d7da' : '#d4edda')};
  color: ${(props) => (props.$variant === 'error' ? '#721c24' : '#155724')};
  border: 1px solid
    ${(props) => (props.$variant === 'error' ? '#f5c6cb' : '#c3e6cb')};
  font-size: 1rem;
  border-radius: 6px;
  padding: 0.8em 1.2em;
  margin-bottom: 1em;
`

const Notification = () => {
  const notification = useNotificationValue()
  if (notification === null) {
    return null
  }

  return (
    <NotificationContainer className="notification" $variant={notification.variant}>
      {notification.message}
    </NotificationContainer>
  )
}

export default Notification
