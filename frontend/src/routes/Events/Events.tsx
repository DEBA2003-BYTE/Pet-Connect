import { useState, useEffect } from 'react'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import { useUserLocation, sortByDistance, calculateDistance } from '../../hooks/useUserLocation'
import './Events.css'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
}

interface Event {
  _id: string
  organizerId: User
  title: string
  description: string
  type: 'COMPETITION' | 'VACCINATION_DRIVE' | 'ADOPTION_CAMP' | 'WORKSHOP' | 'MEETUP' | 'OTHER'
  images: string[]
  location: {
    type: string
    coordinates: [number, number]
  }
  address: string
  venue: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  registrationDeadline: string
  maxParticipants?: number
  registrationFee?: number
  requirements?: string[]
  prizes?: string[]
  agenda?: string
  contactEmail?: string
  contactPhone?: string
  registrations: any[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

interface Pet {
  _id: string
  name: string
  species: string
  breed?: string
  photos: string[]
}

export default function Events() {
  const { location: gpsLocation } = useUserLocation()
  const [events, setEvents] = useState<Event[]>([])
  const [myPets, setMyPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterTime, setFilterTime] = useState<string>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'COMPETITION' as Event['type'],
    images: [] as string[],
    address: '',
    venue: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    maxParticipants: '',
    registrationFee: '',
    requirements: '',
    prizes: '',
    agenda: '',
    contactEmail: '',
    contactPhone: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchMyPets()
    getUserLocation()
  }, [filterType, filterTime])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filterType !== 'all') params.type = filterType
      if (filterTime === 'upcoming') params.upcoming = 'true'
      
      const { data } = await api.get('/events', { params })
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPets = async () => {
    try {
      const { data } = await api.get('/pets/my-pets')
      setMyPets(data)
    } catch (error) {
      console.error('Failed to fetch pets', error)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userLocation) {
      alert('Please enable location access to create an event')
      return
    }

    try {
      const eventData = {
        ...formData,
        location: {
          type: 'Point',
          coordinates: userLocation
        },
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : 0,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
        prizes: formData.prizes ? formData.prizes.split('\n').filter(p => p.trim()) : []
      }

      await api.post('/events', eventData)
      alert('✅ Event created successfully!')
      setShowCreateForm(false)
      resetForm()
      fetchEvents()
    } catch (error: any) {
      alert(`❌ Failed to create event: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleRegister = async (eventId: string, petId?: string) => {
    try {
      await api.post(`/events/${eventId}/register`, { petId })
      alert('✅ Registered successfully!')
      fetchEvents()
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || 'Registration failed'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'COMPETITION',
      images: [],
      address: '',
      venue: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      registrationDeadline: '',
      maxParticipants: '',
      registrationFee: '',
      requirements: '',
      prizes: '',
      agenda: '',
      contactEmail: '',
      contactPhone: ''
    })
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      COMPETITION: '#F59E0B',
      VACCINATION_DRIVE: '#3B82F6',
      ADOPTION_CAMP: '#10B981',
      WORKSHOP: '#8B5CF6',
      MEETUP: '#EC4899',
      OTHER: '#6B7280'
    }
    return colors[type] || '#6B7280'
  }

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      COMPETITION: '🏆',
      VACCINATION_DRIVE: '💉',
      ADOPTION_CAMP: '🏠',
      WORKSHOP: '📚',
      MEETUP: '👥',
      OTHER: '📅'
    }
    return icons[type] || '📅'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  let filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Filter within 60km and sort by distance from user location
  if (gpsLocation && !gpsLocation.error) {
    filteredEvents = sortByDistance(filteredEvents, gpsLocation.latitude, gpsLocation.longitude, 60)
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>🎉 Events & Activities</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="create-event-card">
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
                  required
                >
                  <option value="COMPETITION">Competition</option>
                  <option value="VACCINATION_DRIVE">Vaccination Drive</option>
                  <option value="ADOPTION_CAMP">Adoption Camp</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Event Images</label>
              <ImageUpload
                onUploadComplete={(url) => setFormData({ ...formData, images: [...formData.images, url] })}
                maxFiles={5}
                currentImages={formData.images}
              />
              {formData.images.length > 0 && (
                <div className="uploaded-images">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="uploaded-image">
                      <img src={img} alt={`Upload ${idx + 1}`} />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Venue *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Registration Deadline *</label>
                <input
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Registration Fee (₹)</label>
                <input
                  type="number"
                  value={formData.registrationFee}
                  onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                  placeholder="0 for free"
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Requirements (one per line)</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
                placeholder="Pet vaccination certificate&#10;Owner ID proof"
              />
            </div>

            {formData.type === 'COMPETITION' && (
              <div className="form-group">
                <label>Prizes (one per line)</label>
                <textarea
                  value={formData.prizes}
                  onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                  rows={3}
                  placeholder="1st Prize: ₹10,000&#10;2nd Prize: ₹5,000"
                />
              </div>
            )}

            <div className="form-group">
              <label>Agenda</label>
              <textarea
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                rows={3}
                placeholder="Event schedule and activities"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Create Event
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="events-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="COMPETITION">Competition</option>
            <option value="VACCINATION_DRIVE">Vaccination Drive</option>
            <option value="ADOPTION_CAMP">Adoption Camp</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="MEETUP">Meetup</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Time:</label>
          <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="all">All Events</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event._id} className="event-card">
              {event.images.length > 0 && (
                <div className="event-image">
                  <img src={event.images[0]} alt={event.title} />
                  <div 
                    className="event-type-badge"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  >
                    {getEventTypeIcon(event.type)} {event.type.replace('_', ' ')}
                  </div>
                </div>
              )}

              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">⏰</span>
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{event.venue}, {event.address}</span>
                  </div>
                  {gpsLocation && !gpsLocation.error && event.location?.coordinates && (
                    <div className="detail-item">
                      <span className="icon">🚗</span>
                      <span>{calculateDistance(
                        gpsLocation.latitude,
                        gpsLocation.longitude,
                        event.location.coordinates[1],
                        event.location.coordinates[0]
                      ).toFixed(1)} km away</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="icon">👥</span>
                    <span>
                      {event.registrations.length}
                      {event.maxParticipants ? `/${event.maxParticipants}` : ''} registered
                    </span>
                  </div>
                  {event.registrationFee && event.registrationFee > 0 && (
                    <div className="detail-item">
                      <span className="icon">💰</span>
                      <span>₹{event.registrationFee}</span>
                    </div>
                  )}
                </div>

                <div className="event-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <p>No events found. Be the first to create one!</p>
            </div>
          )}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
            
            <h2>{selectedEvent.title}</h2>
            
            {selectedEvent.images.length > 0 && (
              <div className="event-images-gallery">
                {selectedEvent.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Event ${idx + 1}`} />
                ))}
              </div>
            )}

            <div 
              className="event-type-badge"
              style={{ backgroundColor: getEventTypeColor(selectedEvent.type) }}
            >
              {getEventTypeIcon(selectedEvent.type)} {selectedEvent.type.replace('_', ' ')}
            </div>

            <p>{selectedEvent.description}</p>

            <div className="event-info-grid">
              <div className="info-item">
                <strong>📅 Date:</strong>
                <span>{formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}</span>
              </div>
              <div className="info-item">
                <strong>⏰ Time:</strong>
                <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
              <div className="info-item">
                <strong>📍 Venue:</strong>
                <span>{selectedEvent.venue}</span>
              </div>
              <div className="info-item">
                <strong>🗺️ Address:</strong>
                <span>{selectedEvent.address}</span>
              </div>
              <div className="info-item">
                <strong>📝 Registration Deadline:</strong>
                <span>{formatDate(selectedEvent.registrationDeadline)}</span>
              </div>
              {selectedEvent.maxParticipants && (
                <div className="info-item">
                  <strong>👥 Capacity:</strong>
                  <span>{selectedEvent.registrations.length}/{selectedEvent.maxParticipants}</span>
                </div>
              )}
              {selectedEvent.registrationFee && selectedEvent.registrationFee > 0 && (
                <div className="info-item">
                  <strong>💰 Fee:</strong>
                  <span>₹{selectedEvent.registrationFee}</span>
                </div>
              )}
            </div>

            {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
              <div className="event-section">
                <h3>Requirements</h3>
                <ul>
                  {selectedEvent.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
              <div className="event-section">
                <h3>Prizes</h3>
                <ul>
                  {selectedEvent.prizes.map((prize, idx) => (
                    <li key={idx}>{prize}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.agenda && (
              <div className="event-section">
                <h3>Agenda</h3>
                <p>{selectedEvent.agenda}</p>
              </div>
            )}

            {(selectedEvent.contactEmail || selectedEvent.contactPhone) && (
              <div className="event-section">
                <h3>Contact</h3>
                {selectedEvent.contactEmail && <p>📧 {selectedEvent.contactEmail}</p>}
                {selectedEvent.contactPhone && <p>📞 {selectedEvent.contactPhone}</p>}
              </div>
            )}

            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                handleRegister(selectedEvent._id)
                setSelectedEvent(null)
              }}
            >
              Register for Event
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
