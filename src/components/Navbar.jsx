import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiLogOut, FiUser, FiSettings } from 'react-icons/fi'
import './Navbar.css'

export default function Navbar() {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🧠</span>
          <span>Mental Health Platform</span>
        </Link>

        <div className="navbar-menu">
          {isAdmin && (
            <Link to="/admin" className="navbar-link">
              Admin Dashboard
            </Link>
          )}
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <div className="navbar-user">
            <FiUser className="user-icon" />
            <span>{profile?.full_name || profile?.email}</span>
            <button onClick={handleSignOut} className="logout-btn" title="Sign Out">
              <FiLogOut />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

