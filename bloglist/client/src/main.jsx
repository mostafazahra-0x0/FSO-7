import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './contexts/NotificationContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <Router>
      <App />
    </Router>
  </NotificationContextProvider>
)
