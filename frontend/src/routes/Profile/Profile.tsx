import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Profile.css'

interface UserProfile {
  _id: string
  name: string
  email: string
  role: string
  phone?: string
  city?: string
  isVerified: boolean
  createdAt: string
}

export default function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/me')
      setProfile(data)
      setFormData({
        name: data.name,
        phone: data.phone || '',
        city: data.city || ''
      })
    } catch (error) {
      console.error('Failed to fetch profile', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    try {
      const { data } = await api.put('/users/me', formData)
      setProfile(data)
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to change password')
    }
  }

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      PET_OWNER: { label: 'Pet Owner', color: '#3b82f6' },
      VOLUNTEER: { label: 'Volunteer', color: '#10b981' },
      NGO: { label: 'NGO/Rescue', color: '#8b5cf6' },
      VET: { label: 'Veterinarian', color: '#f59e0b' },
      SERVICE_PROVIDER: { label: 'Service Provider', color: '#ec4899' }
    }
    return badges[role] || { label: role, color: '#6b7280' }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="error-message">Failed to load profile</div>
      </div>
    )
  }

  const roleBadge = getRoleBadge(profile.role)

  return (
    <div className="container profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <span 
                className="role-badge" 
                style={{ backgroundColor: roleBadge.color }}
              >
                {roleBadge.label}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{profile.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{profile.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">City</span>
              <span className="detail-value">{profile.city || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Verification Status</span>
              <span className={`status-badge ${profile.isVerified ? 'verified' : 'unverified'}`}>
                {profile.isVerified ? '✓ Verified' : 'Not Verified'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-actions">
          {isEditing && (
            <div className="card">
              <h3>Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          <div className="card">
            <h3>Security</h3>
            {!showPasswordForm ? (
              <button 
                onClick={() => setShowPasswordForm(true)} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {profile.role === 'VOLUNTEER' && (
            <div className="card">
              <h3>Volunteer Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Rescues Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Credits Earned</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Badges</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
