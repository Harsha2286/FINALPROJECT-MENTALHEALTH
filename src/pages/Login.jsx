import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'An error occurred. Please try again.')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-container login-google-style">
      <div className="auth-card login-card">
        <div className="auth-header login-header">
          <h1>Sign in</h1>
          <p>Use your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group login-form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              className="login-input"
              required
            />
          </div>

          <div className="form-group login-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="login-input"
              required
            />
          </div>

          <div className="login-button-container">
            <Link to="/signup" className="login-link-button">Create account</Link>
            <button type="submit" className="auth-button login-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

