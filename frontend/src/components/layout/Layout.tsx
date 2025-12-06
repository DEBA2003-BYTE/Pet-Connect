import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/dashboard" className="logo">PetConnect</Link>
          <div className="nav-links">
            <Link to="/rescue-map">Rescue Map</Link>
            <Link to="/nearby-services">Services</Link>
            <Link to="/lost-found">Lost & Found</Link>
            <Link to="/adoptions">Adoptions</Link>
            <Link to="/store">Pet Store</Link>
            {user?.role === 'SERVICE_PROVIDER' && (
              <Link to="/seller" className="seller-link">🏪 Seller</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="admin-link">🛡️ Admin</Link>
            )}
            <Link to="/community">Community</Link>
            <Link to="/events">Events</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="btn btn-primary">Logout</button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-content">
          <p>Have questions or need help? Contact us at:</p>
          <a href="mailto:petconnect@gmail.com" className="footer-email">
            📧 petconnect@gmail.com
          </a>
          <p className="footer-copyright">© 2025 PetConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
