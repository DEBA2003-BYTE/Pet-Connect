import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import './RescueMap.css'

interface RescueReport {
  _id: string
  caseNumber: string
  animalType: string
  injuryDescription: string
  severity: string
  status: string
  isAnonymous: boolean
  location: {
    coordinates: [number, number]
  }
  address?: string
  photos: string[]
  contactNumber?: string
  safetyWarnings: {
    isAggressive: boolean
    onRoad: boolean
    isBleeding: boolean
  }
  assignedTo?: {
    name: string
    phone?: string
  }
  estimatedArrival?: string
  reporterId?: {
    name: string
    phone?: string
  }
  createdAt: string
}

function LocationMarker({ 
  onLocationSelect, 
  selectedLocation 
}: { 
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation: [number, number] | null
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return selectedLocation === null ? null : (
    <Marker 
      position={selectedLocation}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          onLocationSelect(position.lat, position.lng)
        }
      }}
    >
      <Popup>
        <div>
          <strong>📍 Selected Location</strong>
          <p>Drag marker to adjust</p>
          <p>Lat: {selectedLocation[0].toFixed(6)}</p>
          <p>Lng: {selectedLocation[1].toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  )
}

export default function RescueMap() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [rescues, setRescues] = useState<RescueReport[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  
  const [formData, setFormData] = useState({
    animalType: '',
    injuryDescription: '',
    severity: 'MODERATE',
    location: { coordinates: [77.2090, 28.6139] },
    address: '',
    photos: [] as string[],
    contactNumber: '',
    safetyWarnings: {
      isAggressive: false,
      onRoad: false,
      isBleeding: false
    },
    isAnonymous: false
  })

  useEffect(() => {
    // Auto-detect user's current location on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCenter([lat, lng])
          setUserLocation([lat, lng])
          fetchNearbyRescues(lat, lng)
        },
        () => {
          // Fallback to Delhi if location access denied
          fetchNearbyRescues(28.6139, 77.2090)
        }
      )
    } else {
      fetchNearbyRescues(28.6139, 77.2090)
    }
  }, [])

  const fetchNearbyRescues = async (lat: number, lng: number) => {
    try {
      const { data } = await api.get(`/rescues/nearby?lat=${lat}&lng=${lng}&radius=10`)
      setRescues(data)
    } catch (error) {
      console.error('Failed to fetch rescues', error)
    }
  }

  const handleUseCurrentLocation = () => {
    setDetectingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setSelectedLocation([lat, lng])
          setCenter([lat, lng])
          setUserLocation([lat, lng])
          setFormData({
            ...formData,
            location: { coordinates: [lng, lat] }
          })
          
          // Simple address display
          setAddress(`📍 Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
          setDetectingLocation(false)
        },
        (error) => {
          alert('Unable to detect location. Please select manually on map.')
          setDetectingLocation(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setDetectingLocation(false)
    }
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng])
    setFormData({
      ...formData,
      location: { coordinates: [lng, lat] }
    })
    setAddress(`📍 Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }

  const calculateDistance = (coords: [number, number]) => {
    if (!userLocation) return 'N/A'
    
    const R = 6371 // Earth's radius in km
    const dLat = (coords[1] - userLocation[0]) * Math.PI / 180
    const dLon = (coords[0] - userLocation[1]) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation[0] * Math.PI / 180) * Math.cos(coords[1] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1) + ' km'
  }

  const isNightTime = () => {
    const hour = new Date().getHours()
    return hour >= 19 || hour < 6 // 7 PM to 6 AM
  }

  const generateTags = (description: string) => {
    const tags: string[] = []
    const lowerDesc = description.toLowerCase()
    
    if (lowerDesc.includes('fracture') || lowerDesc.includes('broken')) tags.push('#fracture')
    if (lowerDesc.includes('hit') || lowerDesc.includes('accident')) tags.push('#hitAndRun')
    if (lowerDesc.includes('puppy') || lowerDesc.includes('abandoned')) tags.push('#abandonedPuppy')
    if (lowerDesc.includes('electric') || lowerDesc.includes('shock')) tags.push('#electrocution')
    if (lowerDesc.includes('cow') || lowerDesc.includes('cattle')) tags.push('#injuredCow')
    if (lowerDesc.includes('attack') || lowerDesc.includes('bite')) tags.push('#strayDogAttack')
    
    return tags
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedLocation) {
      alert('Please select a location on the map')
      return
    }

    setLoading(true)

    try {
      const tags = generateTags(formData.injuryDescription)
      const nightEmergency = isNightTime()
      
      const { data } = await api.post('/rescues', {
        ...formData,
        address,
        tags,
        isNightEmergency: nightEmergency
      })
      
      const alertMessage = `✅ Rescue reported successfully!\n\n` +
        `Case Number: ${data.caseNumber}\n` +
        `Severity: ${formData.severity}\n` +
        (nightEmergency ? `🌙 Night Emergency - 24/7 NGOs notified\n` : '') +
        (tags.length > 0 ? `Tags: ${tags.join(' ')}\n` : '') +
        `\nNearby volunteers and NGOs have been notified.`
      
      alert(alertMessage)
      
      setShowForm(false)
      setFormData({
        animalType: '',
        injuryDescription: '',
        severity: 'MODERATE',
        location: { coordinates: [77.2090, 28.6139] },
        address: '',
        photos: [],
        contactNumber: '',
        safetyWarnings: {
          isAggressive: false,
          onRoad: false,
          isBleeding: false
        },
        isAnonymous: false
      })
      setSelectedLocation(null)
      setAddress('')
      setIsAnonymous(false)
      fetchNearbyRescues(center[0], center[1])
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit rescue report')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#ef4444'
      case 'ACCEPTED': return '#f59e0b'
      case 'IN_PROGRESS': return '#3b82f6'
      case 'RESOLVED': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="rescue-map-container">
      <div className="rescue-sidebar">
        <div className="sidebar-header">
          <h2>🚨 Rescue Map</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Report Injured Animal'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rescue-form">
            <h3>Report an Injured Animal</h3>
            
            <div className="form-group">
              <label>Animal Type</label>
              <select
                value={formData.animalType}
                onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                required
              >
                <option value="">Select animal type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Cow">Cow</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Injury Description</label>
              <textarea
                value={formData.injuryDescription}
                onChange={(e) => setFormData({ ...formData, injuryDescription: e.target.value })}
                placeholder="Describe the injury and condition..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Injury Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                required
              >
                <option value="MINOR">🟢 Minor - Can wait</option>
                <option value="MODERATE">🟡 Moderate - Needs attention</option>
                <option value="SEVERE">🔴 Severe - Critical emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label>Safety Warnings</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.safetyWarnings.isAggressive}
                    onChange={(e) => setFormData({
                      ...formData,
                      safetyWarnings: { ...formData.safetyWarnings, isAggressive: e.target.checked }
                    })}
                  />
                  ⚠️ Animal is aggressive
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.safetyWarnings.onRoad}
                    onChange={(e) => setFormData({
                      ...formData,
                      safetyWarnings: { ...formData.safetyWarnings, onRoad: e.target.checked }
                    })}
                  />
                  🚗 On busy road
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.safetyWarnings.isBleeding}
                    onChange={(e) => setFormData({
                      ...formData,
                      safetyWarnings: { ...formData.safetyWarnings, isBleeding: e.target.checked }
                    })}
                  />
                  🩸 Bleeding heavily
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleUseCurrentLocation}
                disabled={detectingLocation}
              >
                {detectingLocation ? '📍 Detecting...' : '📍 Use Current Location'}
              </button>
              <p className="help-text">
                {address || (selectedLocation 
                  ? `Selected: ${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`
                  : 'Click on the map or use current location')}
              </p>
            </div>

            <div className="form-group">
              <label>Contact Number (Optional)</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label>Photos (Up to 3)</label>
              <ImageUpload
                onUploadComplete={(url) => {
                  if (formData.photos.length < 3) {
                    setFormData({ ...formData, photos: [...formData.photos, url] })
                  }
                }}
                folder="rescue-reports"
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
                        className="remove-image"
                        onClick={() => {
                          const newPhotos = formData.photos.filter((_, i) => i !== index)
                          setFormData({ ...formData, photos: newPhotos })
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                />
                🕶️ Report anonymously
              </label>
            </div>

            {isNightTime() && (
              <div className="night-alert">
                🌙 Night Emergency Detected - 24/7 NGOs will be prioritized
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading || !selectedLocation}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        )}

        <div className="rescue-list">
          <h3>Nearby Rescues ({rescues.length})</h3>
          <div className="rescue-items">
            {rescues.map((rescue) => (
              <div key={rescue._id} className="rescue-item">
                <div className="rescue-header">
                  <span className="case-number">#{rescue.caseNumber}</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(rescue.status) }}
                  >
                    {rescue.status}
                  </span>
                </div>
                
                <div className="rescue-title">
                  <span className="animal-type">{rescue.animalType}</span>
                  <span className={`severity-badge severity-${rescue.severity.toLowerCase()}`}>
                    {rescue.severity === 'SEVERE' && '🔴'}
                    {rescue.severity === 'MODERATE' && '🟡'}
                    {rescue.severity === 'MINOR' && '🟢'}
                    {' '}{rescue.severity}
                  </span>
                </div>
                
                <p className="injury-desc">{rescue.injuryDescription}</p>
                
                {(rescue.safetyWarnings.isAggressive || rescue.safetyWarnings.onRoad || rescue.safetyWarnings.isBleeding) && (
                  <div className="safety-warnings">
                    {rescue.safetyWarnings.isAggressive && <span className="warning-tag">⚠️ Aggressive</span>}
                    {rescue.safetyWarnings.onRoad && <span className="warning-tag">🚗 On Road</span>}
                    {rescue.safetyWarnings.isBleeding && <span className="warning-tag">🩸 Bleeding</span>}
                  </div>
                )}
                
                <div className="rescue-meta">
                  <span>📍 {rescue.address || `${rescue.location.coordinates[1].toFixed(4)}, ${rescue.location.coordinates[0].toFixed(4)}`}</span>
                  {userLocation && (
                    <span>📏 {calculateDistance(rescue.location.coordinates)}</span>
                  )}
                </div>
                
                <div className="rescue-footer">
                  <span>👤 {rescue.isAnonymous ? 'Anonymous' : (rescue.reporterId?.name || 'Anonymous')}</span>
                  {rescue.assignedTo && (
                    <span className="assigned-to">
                      🚑 {rescue.assignedTo.name}
                      {rescue.estimatedArrival && ` • ETA: ${new Date(rescue.estimatedArrival).toLocaleTimeString()}`}
                    </span>
                  )}
                </div>
                
                <span className="rescue-time">
                  {new Date(rescue.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
            {rescues.length === 0 && (
              <p className="no-rescues">No rescue reports in this area</p>
            )}
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {showForm && <LocationMarker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />}
          
          {rescues.map((rescue) => (
            <Marker 
              key={rescue._id}
              position={[rescue.location.coordinates[1], rescue.location.coordinates[0]]}
            >
              <Popup>
                <div className="rescue-popup">
                  <h4>{rescue.animalType}</h4>
                  <p><strong>Status:</strong> {rescue.status}</p>
                  <p>{rescue.injuryDescription}</p>
                  <p><strong>Reported by:</strong> {rescue.isAnonymous ? 'Anonymous' : (rescue.reporterId?.name || 'Anonymous')}</p>
                  <p><strong>Time:</strong> {new Date(rescue.createdAt).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
