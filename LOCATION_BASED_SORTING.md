# 📍 GPS Location-Based Sorting Feature

## Overview
All major features now automatically sort content by distance from the user's current GPS location, showing nearest items first.

## Features with Location Sorting

### 1. **Rescue Map** 🚨
- Already fetches nearby rescues within 10km radius
- Automatically centers on user's location
- Shows rescue reports sorted by proximity

### 2. **Lost & Found** 🐾
- Pets are sorted by distance from user
- Shows distance in km on each card
- Nearest lost/found pets appear first

### 3. **Adoption Listings** ❤️
- Adoption listings sorted by proximity
- Distance displayed on each listing card
- User's location automatically captured when creating listing

### 4. **Events** 🎉
- Events sorted by distance from user
- Distance shown on event cards
- Helps users find nearby events easily

### 5. **Nearby Services** 🏥
- Already location-based
- Fetches services within radius
- Shows veterinarians and clinics nearby

## How It Works

### User Location Detection
- Automatically requests GPS permission on page load
- Falls back to Delhi (28.6139, 77.2090) if permission denied
- Uses browser's Geolocation API for accuracy

### Distance Calculation
- Uses Haversine formula for accurate distance
- Calculates distance in kilometers
- Sorts items from nearest to farthest

### Privacy
- Location is only used client-side for sorting
- No location data stored without user consent
- Users can deny location permission (defaults to Delhi)

## User Experience

### What Users See:
1. **Permission Request**: Browser asks for location access
2. **Automatic Sorting**: Content automatically sorted by distance
3. **Distance Display**: "📍 Distance: 2.5 km away" shown on cards
4. **Nearest First**: Most relevant (nearest) items appear at the top

### Benefits:
- ✅ Find nearby pets faster
- ✅ Discover local events easily
- ✅ Connect with nearby services
- ✅ More relevant search results
- ✅ Better user experience

## Technical Implementation

### Custom Hook: `useUserLocation`
```typescript
const { location, loading } = useUserLocation()
// location: { latitude, longitude, error? }
```

### Distance Calculation
```typescript
calculateDistance(lat1, lon1, lat2, lon2) // Returns km
```

### Sorting Function
```typescript
sortByDistance(items, userLat, userLon) // Returns sorted array
```

## Database Requirements

All location-enabled features store coordinates in MongoDB GeoJSON format:
```javascript
location: {
  type: 'Point',
  coordinates: [longitude, latitude] // Note: [lng, lat] order
}
```

## Future Enhancements

- [ ] Add radius filter (5km, 10km, 25km, 50km)
- [ ] Show items on map view
- [ ] Add "Near Me" quick filter button
- [ ] Cache user location for session
- [ ] Add manual location selection option

## Testing

To test location-based sorting:
1. Allow location access when prompted
2. Create test data with different locations
3. Verify items are sorted by distance
4. Check distance calculations are accurate
5. Test fallback when location denied

---

**Note**: For adoption listings to show distance, users need to allow location access when creating the listing. The location is automatically captured from their GPS.
