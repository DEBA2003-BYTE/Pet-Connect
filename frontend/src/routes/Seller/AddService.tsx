import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'

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
    />
  )
}

export default function AddService() {
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'VET',
    address: '',
    phone: '',
    website: '',
    description: '',
    operatingHours: '',
    services: [] as string[],
    location: { coordinates: [77.2090, 28.6139] }
  })

  const serviceTypes = [
    { value: 'VET', label: 'Veterinarian' },
    { value: 'CLINIC_24X7', label: '24/7 Clinic' },
    { value: 'GROOMER', label: 'Groomer' },
    { value: 'TRAINER', label: 'Trainer' },
    { value: 'PARK', label: 'Pet Park' },
    { value: 'CAFE', label: 'Pet Café' },
    { value: 'BOARDING', label: 'Boarding' }
  ]

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setSelectedLocation([lat, lng])
          setFormData({
            ...formData,
            location: { coordinates: [lng, lat] }
          })
        },
        () => {
          alert('Unable to detect location. Please select manually on map.')
        }
      )
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
    
    if (!selectedLocation) {
      alert('Please select a location on the map')
      return
    }

    setLoading(true)

    try {
      await api.post('/services', formData)
      alert('✅ Service added successfully!')
      
      // Reset form
      setFormData({
        name: '',
        type: 'VET',
        address: '',
        phone: '',
        website: '',
        description: '',
        operatingHours: '',
        services: [],
        location: { coordinates: [77.2090, 28.6139] }
      })
      setSelectedLocation(null)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-service-container">
      <h2>Add New Service</h2>
      
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-row">
          <div className="form-group">
            <label>Service Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Happy Paws Veterinary Clinic"
              required
            />
          </div>

          <div className="form-group">
            <label>Service Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              {serviceTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full address"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Contact number"
              required
            />
          </div>

          <div className="form-group">
            <label>Website (Optional)</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your services..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Operating Hours</label>
          <input
            type="text"
            value={formData.operatingHours}
            onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            placeholder="e.g., Mon-Sat: 9AM-6PM, Sun: Closed"
          />
        </div>

        <div className="form-group">
          <label>Location on Map *</label>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleUseCurrentLocation}
          >
            📍 Use Current Location
          </button>
          <p className="help-text">
            {selectedLocation 
              ? `Selected: ${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`
              : 'Click on the map to select location'}
          </p>
        </div>

        <div className="map-container">
          <MapContainer 
            center={selectedLocation || [28.6139, 77.2090]} 
            zoom={13} 
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker 
              onLocationSelect={handleLocationSelect} 
              selectedLocation={selectedLocation} 
            />
          </MapContainer>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading || !selectedLocation}
        >
          {loading ? 'Adding Service...' : '✅ Add Service'}
        </button>
      </form>
    </div>
  )
}
