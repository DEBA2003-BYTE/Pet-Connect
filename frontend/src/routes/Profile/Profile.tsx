import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
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

interface Pet {
  _id: string
  name: string
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER'
  breed?: string
  age?: number
  gender?: 'MALE' | 'FEMALE'
  color?: string
  weight?: number
  photos: string[]
  description?: string
}

interface Event {
  _id: string
  title: string
  type: string
  startDate: string
  endDate: string
  address: string
  venue: string
  images: string[]
  registrations: any[]
}

export default function Profile() {
  const { logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAddPet, setShowAddPet] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  })
  
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'DOG' as Pet['species'],
    breed: '',
    age: '',
    gender: '' as Pet['gender'] | '',
    color: '',
    weight: '',
    photos: [] as string[],
    description: ''
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
    fetchPets()
    fetchEvents()
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

  const fetchPets = async () => {
    try {
      const { data } = await api.get('/pets/my-pets')
      setPets(data)
    } catch (error) {
      console.error('Failed to fetch pets', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events/user/registered')
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events', error)
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

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const petData = {
        ...petFormData,
        age: petFormData.age ? parseInt(petFormData.age) : undefined,
        weight: petFormData.weight ? parseFloat(petFormData.weight) : undefined,
        gender: petFormData.gender || undefined
      }

      await api.post('/pets', petData)
      setMessage('Pet added successfully!')
      setShowAddPet(false)
      resetPetForm()
      fetchPets()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add pet')
    }
  }

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return

    try {
      await api.delete(`/pets/${petId}`)
      setMessage('Pet deleted successfully!')
      fetchPets()
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete pet')
    }
  }

  const resetPetForm = () => {
    setPetFormData({
      name: '',
      species: 'DOG',
      breed: '',
      age: '',
      gender: '',
      color: '',
      weight: '',
      photos: [],
      description: ''
    })
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

  const getSpeciesIcon = (species: string) => {
    const icons: Record<string, string> = {
      DOG: '🐕',
      CAT: '🐱',
      BIRD: '🐦',
      RABBIT: '🐰',
      OTHER: '🐾'
    }
    return icons[species] || '🐾'
  }

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date())
  const pastEvents = events.filter(e => new Date(e.startDate) < new Date())

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

      {/* My Pets Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>🐾 My Pets</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddPet(!showAddPet)}
          >
            {showAddPet ? 'Cancel' : '+ Add Pet'}
          </button>
        </div>

        {showAddPet && (
          <div className="card add-pet-form">
            <h3>Add New Pet</h3>
            <form onSubmit={handleAddPet} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Name *</label>
                  <input
                    type="text"
                    value={petFormData.name}
                    onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Species *</label>
                  <select
                    value={petFormData.species}
                    onChange={(e) => setPetFormData({ ...petFormData, species: e.target.value as Pet['species'] })}
                    required
                  >
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                    <option value="BIRD">Bird</option>
                    <option value="RABBIT">Rabbit</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={petFormData.breed}
                    onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    value={petFormData.age}
                    onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={petFormData.gender}
                    onChange={(e) => setPetFormData({ ...petFormData, gender: e.target.value as Pet['gender'] | '' })}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={petFormData.color}
                    onChange={(e) => setPetFormData({ ...petFormData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={petFormData.weight}
                  onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Photos</label>
                <ImageUpload
                  onUploadComplete={(url) => setPetFormData({ ...petFormData, photos: [...petFormData.photos, url] })}
                  maxFiles={5}
                  currentImages={petFormData.photos}
                />
                {petFormData.photos.length > 0 && (
                  <div className="uploaded-images">
                    {petFormData.photos.map((img, idx) => (
                      <div key={idx} className="uploaded-image">
                        <img src={img} alt={`Pet ${idx + 1}`} />
                        <button 
                          type="button"
                          className="remove-image"
                          onClick={() => setPetFormData({ ...petFormData, photos: petFormData.photos.filter((_, i) => i !== idx) })}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={petFormData.description}
                  onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Pet
              </button>
            </form>
          </div>
        )}

        <div className="pets-grid">
          {pets.map(pet => (
            <div key={pet._id} className="pet-card">
              <div className="pet-image">
                {pet.photos.length > 0 ? (
                  <img src={pet.photos[0]} alt={pet.name} />
                ) : (
                  <div className="pet-placeholder">
                    {getSpeciesIcon(pet.species)}
                  </div>
                )}
              </div>
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p className="pet-species">{getSpeciesIcon(pet.species)} {pet.species}</p>
                {pet.breed && <p className="pet-detail">Breed: {pet.breed}</p>}
                {pet.age && <p className="pet-detail">Age: {pet.age} years</p>}
                {pet.gender && <p className="pet-detail">Gender: {pet.gender}</p>}
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => handleDeletePet(pet._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {pets.length === 0 && !showAddPet && (
            <div className="no-pets">
              <p>No pets added yet. Click "Add Pet" to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Events Participated Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>🎉 Events Participated</h2>
        </div>

        <div className="events-tabs">
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({pastEvents.length})
          </button>
        </div>

        <div className="events-list">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => (
            <div key={event._id} className="event-item">
              {event.images.length > 0 && (
                <div className="event-thumbnail">
                  <img src={event.images[0]} alt={event.title} />
                </div>
              )}
              <div className="event-details">
                <h3>{event.title}</h3>
                <p className="event-type">{event.type.replace('_', ' ')}</p>
                <p className="event-date">
                  📅 {formatEventDate(event.startDate)} - {formatEventDate(event.endDate)}
                </p>
                <p className="event-location">📍 {event.venue}, {event.address}</p>
              </div>
              <div className="event-status">
                <span className="status-badge confirmed">Registered</span>
              </div>
            </div>
          ))}

          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 && (
            <div className="no-events">
              <p>No {activeTab} events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
