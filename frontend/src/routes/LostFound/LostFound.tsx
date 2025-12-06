import { useState, useEffect } from 'react'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import { useUserLocation, sortByDistance, calculateDistance } from '../../hooks/useUserLocation'
import './LostFound.css'

interface LostFoundPet {
  _id: string
  status: 'LOST' | 'FOUND' | 'RECOVERED'
  petType: string
  breed?: string
  color?: string
  description: string
  uniqueMarks?: string
  lastSeenLocation: {
    coordinates: [number, number]
  }
  lastSeenTime: string
  photos: string[]
  ownerId: {
    name: string
    phone?: string
    email?: string
  }
  createdAt: string
}

export default function LostFound() {
  const { location: userLocation } = useUserLocation()
  const [pets, setPets] = useState<LostFoundPet[]>([])
  const [filteredPets, setFilteredPets] = useState<LostFoundPet[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [petTypeFilter, setPetTypeFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'LOST' | 'FOUND'>('LOST')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    status: 'LOST' as 'LOST' | 'FOUND',
    petType: '',
    breed: '',
    color: '',
    description: '',
    uniqueMarks: '',
    lastSeenLocation: { coordinates: [77.2090, 28.6139] },
    lastSeenTime: '',
    photos: [] as string[]
  })

  useEffect(() => {
    fetchPets()
  }, [])

  useEffect(() => {
    let filtered = pets

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (petTypeFilter !== 'ALL') {
      filtered = filtered.filter(p => p.petType === petTypeFilter)
    }

    // Filter within 60km and sort by distance from user location
    if (userLocation && !userLocation.error) {
      filtered = [...filtered]
        .filter(pet => {
          if (!pet.lastSeenLocation?.coordinates) return false
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pet.lastSeenLocation.coordinates[1],
            pet.lastSeenLocation.coordinates[0]
          )
          return distance <= 60 // Only show within 60km
        })
        .sort((a, b) => {
          if (!a.lastSeenLocation?.coordinates || !b.lastSeenLocation?.coordinates) return 0
          
          const distA = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            a.lastSeenLocation.coordinates[1],
            a.lastSeenLocation.coordinates[0]
          )
          const distB = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            b.lastSeenLocation.coordinates[1],
            b.lastSeenLocation.coordinates[0]
          )
          
          return distA - distB
        })
    }

    setFilteredPets(filtered)
  }, [pets, statusFilter, petTypeFilter, userLocation])

  const fetchPets = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/lost-found')
      setPets(data)
      setFilteredPets(data)
    } catch (error) {
      console.error('Failed to fetch lost/found pets', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (type: 'LOST' | 'FOUND') => {
    setFormType(type)
    setFormData({ ...formData, status: type })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/lost-found', formData)
      alert(`${formType} pet report submitted successfully!`)
      setShowForm(false)
      setFormData({
        status: 'LOST',
        petType: '',
        breed: '',
        color: '',
        description: '',
        uniqueMarks: '',
        lastSeenLocation: { coordinates: [77.2090, 28.6139] },
        lastSeenTime: '',
        photos: []
      })
      fetchPets()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOST': return '#ef4444'
      case 'FOUND': return '#f59e0b'
      case 'RECOVERED': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="lostfound-container">
      <div className="lostfound-header">
        <h1>🐾 Lost & Found Pets</h1>
        <div className="header-actions">
          <button 
            className="btn btn-danger"
            onClick={() => handleOpenForm('LOST')}
          >
            Report Lost Pet
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleOpenForm('FOUND')}
          >
            Report Found Pet
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report {formType} Pet</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="lostfound-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pet Type *</label>
                  <select
                    value={formData.petType}
                    onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g., Labrador, Persian"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Brown, White"
                  />
                </div>

                <div className="form-group">
                  <label>Last Seen Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={formData.lastSeenTime}
                    onChange={(e) => setFormData({ ...formData, lastSeenTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the pet..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Unique Marks/Features</label>
                <textarea
                  value={formData.uniqueMarks}
                  onChange={(e) => setFormData({ ...formData, uniqueMarks: e.target.value })}
                  placeholder="Any distinctive features..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Photos</label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, photos: [...formData.photos, url] })}
                  folder="lostfound"
                  maxFiles={3}
                  currentImages={formData.photos}
                />
                {formData.photos.length > 0 && (
                  <div className="uploaded-images">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="uploaded-image">
                        <img src={photo} alt={`Upload ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) })}
                          className="remove-image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="RECOVERED">Recovered</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Pet Type:</label>
          <select value={petTypeFilter} onChange={(e) => setPetTypeFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading pets...</div>
      ) : (
        <div className="pets-grid">
          {filteredPets.map(pet => (
            <div key={pet._id} className="pet-card">
              <div className="pet-header">
                <span className="pet-type">{pet.petType}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(pet.status) }}
                >
                  {pet.status}
                </span>
              </div>

              {pet.photos && pet.photos.length > 0 && (
                <img src={pet.photos[0]} alt={pet.petType} className="pet-image" />
              )}

              <div className="pet-details">
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                {pet.color && <p><strong>Color:</strong> {pet.color}</p>}
                <p><strong>Description:</strong> {pet.description}</p>
                {pet.uniqueMarks && <p><strong>Unique Marks:</strong> {pet.uniqueMarks}</p>}
                <p><strong>Last Seen:</strong> {new Date(pet.lastSeenTime).toLocaleString()}</p>
                {userLocation && !userLocation.error && pet.lastSeenLocation?.coordinates && (
                  <p><strong>📍 Distance:</strong> {calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    pet.lastSeenLocation.coordinates[1],
                    pet.lastSeenLocation.coordinates[0]
                  ).toFixed(1)} km away</p>
                )}
                <p><strong>Reported by:</strong> {pet.ownerId?.name}</p>
                {pet.ownerId?.phone && (
                  <p><strong>Contact:</strong> {pet.ownerId.phone}</p>
                )}
              </div>

              <div className="pet-actions">
                <a href={`tel:${pet.ownerId?.phone}`} className="btn btn-primary btn-sm">
                  📞 Contact
                </a>
              </div>
            </div>
          ))}

          {filteredPets.length === 0 && (
            <div className="no-pets">
              <p>No pets found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
