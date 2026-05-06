/**
 * Next.js has no `App.jsx`; routes come from the filesystem. This file is only the
 * React Router shell. Tutorial parity: imagine this wiring hidden inside the framework.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from '@/app/layout.jsx'
import HomePage from '@/app/page.jsx'
import AboutPage from '@/app/about/page.jsx'
import ContactPage from '@/app/contact/page.jsx'

/** React Router basename: no trailing slash; omit at real root. */
function routerBasename() {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
