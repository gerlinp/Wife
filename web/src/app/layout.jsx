import { Outlet } from 'react-router-dom'
import NavBar from '@/components/NavBar/NavBar.jsx'
import TransitionProvider from '@/providers/TransitionProvider.jsx'

/** NavBar stays outside the `.transition-page` shell; provider wraps both so links can defer navigation until covered. */
export default function RootLayout() {
  return (
    <TransitionProvider>
      <NavBar />
      <div className="transition-page">
        <Outlet />
      </div>
    </TransitionProvider>
  )
}
