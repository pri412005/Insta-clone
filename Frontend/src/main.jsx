import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './app/index.css'

import { AuthProvider } from './feature/auth/context/auth.context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)