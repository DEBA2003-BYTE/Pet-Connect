import { useState, type ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PET_OWNER',
    phone: '',
    city: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    
    try {
      const { confirmPassword, ...signupData } = formData
      await signup(signupData)
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join PetConnect</h1>
          <p>Create your account and start helping pets</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City (Optional)</label>
            <input
              id="city"
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
              disabled={loading}
            >
              <option value="PET_OWNER">Pet Owner</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="NGO">NGO/Rescue Organization</option>
              <option value="VET">Veterinarian</option>
              <option value="SERVICE_PROVIDER">Service Provider</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/auth/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
