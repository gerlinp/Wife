import { TransitionLink } from '@/providers/TransitionProvider.jsx'

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-item">
          <TransitionLink to="/">Serica</TransitionLink>
        </div>
      </div>
      <div className="navbar-items">
        <div className="navbar-item">
          <TransitionLink to="/">Home</TransitionLink>
        </div>
        <div className="navbar-item">
          <TransitionLink to="/about">About</TransitionLink>
        </div>
        <div className="navbar-item">
          <TransitionLink to="/contact">Contact</TransitionLink>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
