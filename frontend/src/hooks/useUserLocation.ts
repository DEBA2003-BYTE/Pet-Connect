import { useState, useEffect } from 'react'

interface Location {
  latitude: number
  longitude: number
  error?: string
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ latitude: 28.6139, longitude: 77.2090, error: 'Geolocation not supported' })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
      },
      (error) => {
        console.warn('Location access denied, using default location (Delhi)', error)
        setLocation({ latitude: 28.6139, longitude: 77.2090, error: error.message })
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  }, [])

  return { location, loading }
}

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

// Sort items by distance from user location and filter by max radius
export const sortByDistance = <T extends { location?: { coordinates: [number, number] } }>(
  items: T[],
  userLat: number,
  userLon: number,
  maxRadius: number = 60 // Default 60km radius
): T[] => {
  return items
    .filter(item => {
      if (!item.location?.coordinates) return false
      const distance = calculateDistance(
        userLat,
        userLon,
        item.location.coordinates[1],
        item.location.coordinates[0]
      )
      return distance <= maxRadius
    })
    .sort((a, b) => {
      if (!a.location?.coordinates || !b.location?.coordinates) return 0
      
      const distA = calculateDistance(userLat, userLon, a.location.coordinates[1], a.location.coordinates[0])
      const distB = calculateDistance(userLat, userLon, b.location.coordinates[1], b.location.coordinates[0])
      
      return distA - distB
    })
}
