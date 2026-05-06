/** Next.js boots differently; this is the Vite entry—loads globals then mounts `<App />`. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
