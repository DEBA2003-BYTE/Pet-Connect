import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'
import './NearbyServices.css'

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Service {
  _id: string
  name: string
  type: string
  location: {
    coordinates: [number, number]
  }
  address?: string
  phone?: string
  website?: string
  isVerified: boolean
  rating?: number
}

export default function NearbyServices() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090])
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [loading, setLoading] = useState(true)

  const serviceTypes = [
    { value: 'ALL', label: 'All Services', icon: '🏥' },
    { value: 'VET', label: 'Veterinarian', icon: '🩺' },
    { value: 'CLINIC_24X7', label: '24/7 Clinic', icon: '🏥' },
    { value: 'GROOMER', label: 'Groomer', icon: '✂️' },
    { value: 'TRAINER', label: 'Trainer', icon: '🎓' },
    { value: 'PARK', label: 'Pet Park', icon: '🌳' },
    { value: 'CAFE', label: 'Pet Café', icon: '☕' },
    { value: 'BOARDING', label: 'Boarding', icon: '🏠' }
  ]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCenter([lat, lng])
          fetchNearbyServices(lat, lng)
        },
        () => {
          fetchNearbyServices(28.6139, 77.2090)
        }
      )
    } else {
      fetchNearbyServices(28.6139, 77.2090)
    }
  }, [])

  useEffect(() => {
    let filtered = services

    if (selectedType !== 'ALL') {
      filtered = filtered.filter(s => s.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredServices(filtered)
  }, [services, selectedType, searchQuery])

  const fetchNearbyServices = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/services/nearby?lat=${lat}&lng=${lng}&radius=10`)
      setServices(data)
      setFilteredServices(data)
    } catch (error) {
      console.error('Failed to fetch services', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (coords: [number, number]) => {
    const R = 6371 // Earth's radius in km
    const dLat = (coords[1] - center[0]) * Math.PI / 180
    const dLon = (coords[0] - center[1]) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(center[0] * Math.PI / 180) * Math.cos(coords[1] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1)
  }

  const getTypeIcon = (type: string) => {
    return serviceTypes.find(t => t.value === type)?.icon || '📍'
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>🏥 Nearby Pet Services</h1>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map
          </button>
        </div>
      </div>

      <div className="services-filters">
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <div className="type-filters">
          {serviceTypes.map(type => (
            <button
              key={type.value}
              className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
              onClick={() => setSelectedType(type.value)}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading services...</div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="services-grid">
              {filteredServices.map(service => (
                <div key={service._id} className="service-card">
                  <div className="service-header">
                    <div className="service-icon">{getTypeIcon(service.type)}</div>
                    <div className="service-info">
                      <h3>{service.name}</h3>
                      {service.isVerified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="service-details">
                    <p className="service-type">{service.type.replace('_', ' ')}</p>
                    {service.address && (
                      <p className="service-address">📍 {service.address}</p>
                    )}
                    <p className="service-distance">
                      📏 {calculateDistance(service.location.coordinates)} km away
                    </p>
                  </div>

                  <div className="service-actions">
                    {service.phone && (
                      <a href={`tel:${service.phone}`} className="btn btn-secondary btn-sm">
                        📞 Call
                      </a>
                    )}
                    {service.website && (
                      <a href={service.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        🌐 Website
                      </a>
                    )}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      🧭 Navigate
                    </a>
                  </div>
                </div>
              ))}
              
              {filteredServices.length === 0 && (
                <div className="no-services">
                  <p>No services found matching your criteria</p>
                </div>
              )}
            </div>
          ) : (
            <div className="map-view">
              <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filteredServices.map(service => (
                  <Marker 
                    key={service._id}
                    position={[service.location.coordinates[1], service.location.coordinates[0]]}
                  >
                    <Popup>
                      <div className="service-popup">
                        <h4>{getTypeIcon(service.type)} {service.name}</h4>
                        <p><strong>Type:</strong> {service.type.replace('_', ' ')}</p>
                        {service.address && <p><strong>Address:</strong> {service.address}</p>}
                        {service.phone && <p><strong>Phone:</strong> {service.phone}</p>}
                        <p><strong>Distance:</strong> {calculateDistance(service.location.coordinates)} km</p>
                        {service.isVerified && <p className="verified">✓ Verified</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
