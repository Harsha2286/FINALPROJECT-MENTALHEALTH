import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUserPlus, FiMail, FiLock, FiUser } from 'react-icons/fi'
import './Auth.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      )

      if (error) {
        console.error('Signup error details:', error)
        // Provide more helpful error messages
        let errorMessage = error.message || 'An error occurred. Please try again.'
        
        if (error.message.includes('fetch') || error.message === 'Failed to fetch') {
          errorMessage = 'Cannot connect to server. Please check:\n1. Your internet connection\n2. Supabase project is active\n3. Browser console for details (F12)'
        } else if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.'
        }
        
        setError(errorMessage)
        setLoading(false)
      } else {
        // Wait a moment for profile to be created
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please check the browser console (F12) for details.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <FiUserPlus />
          </div>
          <h1>Create Account</h1>
          <p>Join our mental health support community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>
              <FiUser className="input-icon" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiMail className="input-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock className="input-icon" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

