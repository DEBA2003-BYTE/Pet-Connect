import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'
import './RescueMap.css'

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface RescueReport {
  _id: string
  animalType: string
  injuryDescription: string
  status: string
  location: {
    coordinates: [number, number]
  }
  photos: string[]
  reporterId: {
    name: string
    phone?: string
  }
  createdAt: string
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  )
}

export default function RescueMap() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090])
  const [rescues, setRescues] = useState<RescueReport[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    animalType: '',
    injuryDescription: '',
    location: { coordinates: [77.2090, 28.6139] },
    photos: [] as string[]
  })
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCenter([lat, lng])
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

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng])
    setFormData({
      ...formData,
      location: { coordinates: [lng, lat] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/rescues', formData)
      alert('Rescue report submitted successfully!')
      setShowForm(false)
      setFormData({
        animalType: '',
        injuryDescription: '',
        location: { coordinates: [77.2090, 28.6139] },
        photos: []
      })
      setSelectedLocation(null)
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
              <label>Location</label>
              <p className="help-text">
                {selectedLocation 
                  ? `Selected: ${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`
                  : 'Click on the map to select location'}
              </p>
            </div>

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
                  <span className="animal-type">{rescue.animalType}</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(rescue.status) }}
                  >
                    {rescue.status}
                  </span>
                </div>
                <p className="injury-desc">{rescue.injuryDescription}</p>
                <div className="rescue-meta">
                  <span>📍 {rescue.location.coordinates[1].toFixed(4)}, {rescue.location.coordinates[0].toFixed(4)}</span>
                  <span>👤 {rescue.reporterId?.name || 'Anonymous'}</span>
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
          
          {showForm && <LocationMarker onLocationSelect={handleLocationSelect} />}
          
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
                  <p><strong>Reported by:</strong> {rescue.reporterId?.name || 'Anonymous'}</p>
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
