import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Adoption.css'

interface AdoptionListing {
  _id: string
  petName: string
  species: string
  age: string
  gender: string
  healthInfo: string
  vaccinationStatus: string
  photos: string[]
  status: 'AVAILABLE' | 'ON_HOLD' | 'ADOPTED'
  ngoId: {
    name: string
    phone?: string
    email?: string
  }
  createdAt: string
}

export default function Adoption() {
  const { user } = useAuth()
  const [listings, setListings] = useState<AdoptionListing[]>([])
  const [filteredListings, setFilteredListings] = useState<AdoptionListing[]>([])
  const [speciesFilter, setSpeciesFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    age: '',
    gender: '',
    healthInfo: '',
    vaccinationStatus: '',
    photos: [] as string[]
  })

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    let filtered = listings

    if (speciesFilter !== 'ALL') {
      filtered = filtered.filter(l => l.species === speciesFilter)
    }

    setFilteredListings(filtered)
  }, [listings, speciesFilter])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/adoptions')
      setListings(data)
      setFilteredListings(data)
    } catch (error) {
      console.error('Failed to fetch adoption listings', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/adoptions', formData)
      alert('Adoption listing created successfully!')
      setShowForm(false)
      setFormData({
        petName: '',
        species: '',
        age: '',
        gender: '',
        healthInfo: '',
        vaccinationStatus: '',
        photos: []
      })
      fetchListings()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!selectedListing) return

    setLoading(true)
    try {
      await api.post(`/adoptions/${selectedListing}/apply`, { message: applicationMessage })
      alert('Application submitted successfully! The NGO will contact you soon.')
      setShowApplicationModal(false)
      setApplicationMessage('')
      setSelectedListing(null)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const openApplicationModal = (listingId: string) => {
    setSelectedListing(listingId)
    setShowApplicationModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#10b981'
      case 'ON_HOLD': return '#f59e0b'
      case 'ADOPTED': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const isNGO = user?.role === 'NGO'

  return (
    <div className="adoption-container">
      <div className="adoption-header">
        <h1>❤️ Adoption Listings</h1>
        {isNGO && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create Listing'}
          </button>
        )}
      </div>

      {showForm && isNGO && (
        <div className="adoption-form-card">
          <h2>Create Adoption Listing</h2>
          <form onSubmit={handleSubmit} className="adoption-form">
            <div className="form-row">
              <div className="form-group">
                <label>Pet Name *</label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                  placeholder="e.g., Buddy"
                  required
                />
              </div>

              <div className="form-group">
                <label>Species *</label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  required
                >
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g., 2 years, 6 months"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Health Information *</label>
              <textarea
                value={formData.healthInfo}
                onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                placeholder="Describe the pet's health condition..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label>Vaccination Status *</label>
              <input
                type="text"
                value={formData.vaccinationStatus}
                onChange={(e) => setFormData({ ...formData, vaccinationStatus: e.target.value })}
                placeholder="e.g., Fully vaccinated, Rabies vaccine done"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      )}

      {showApplicationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply for Adoption</h2>
              <button className="close-btn" onClick={() => setShowApplicationModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Tell the NGO why you'd like to adopt this pet and about your living situation:</p>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="I would like to adopt this pet because..."
                rows={6}
                className="application-textarea"
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowApplicationModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleApply}
                disabled={loading || !applicationMessage.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filters">
        <label>Filter by Species:</label>
        <div className="filter-buttons">
          {['ALL', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(species => (
            <button
              key={species}
              className={`filter-btn ${speciesFilter === species ? 'active' : ''}`}
              onClick={() => setSpeciesFilter(species)}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading adoption listings...</div>
      ) : (
        <div className="listings-grid">
          {filteredListings.map(listing => (
            <div key={listing._id} className="listing-card">
              {listing.photos && listing.photos.length > 0 && (
                <img src={listing.photos[0]} alt={listing.petName} className="listing-image" />
              )}
              
              <div className="listing-content">
                <div className="listing-header">
                  <h3>{listing.petName}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(listing.status) }}
                  >
                    {listing.status}
                  </span>
                </div>

                <div className="listing-details">
                  <p><strong>Species:</strong> {listing.species}</p>
                  <p><strong>Age:</strong> {listing.age}</p>
                  <p><strong>Gender:</strong> {listing.gender}</p>
                  <p><strong>Health:</strong> {listing.healthInfo}</p>
                  <p><strong>Vaccination:</strong> {listing.vaccinationStatus}</p>
                  <p className="ngo-info">
                    <strong>NGO:</strong> {listing.ngoId?.name}
                  </p>
                </div>

                {listing.status === 'AVAILABLE' && (
                  <div className="listing-actions">
                    <button 
                      className="btn btn-primary btn-full"
                      onClick={() => openApplicationModal(listing._id)}
                    >
                      Apply to Adopt
                    </button>
                    {listing.ngoId?.phone && (
                      <a href={`tel:${listing.ngoId.phone}`} className="btn btn-secondary btn-full">
                        📞 Contact NGO
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="no-listings">
              <p>No adoption listings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
