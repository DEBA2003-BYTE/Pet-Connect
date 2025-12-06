# 🚨 Nearby Rescues Feature

## Overview
Added a new "Nearby Rescues (6)" section to the Rescue Map that displays the 6 closest rescue cases within 60km of the user's location, sorted by distance.

## Features

### Visual Design
- **Purple gradient header** - Eye-catching section at the top of the sidebar
- **Grid layout** - 2 columns showing 6 rescue cards
- **Compact cards** - Essential information at a glance
- **Distance badges** - Green badges showing exact distance in km
- **Status indicators** - Color-coded status badges (Open/In Progress/Resolved)

### Functionality
1. **60km Radius Filter** - Only shows rescues within 60km
2. **Distance Sorting** - Nearest rescues appear first
3. **Top 6 Display** - Shows only the 6 closest rescues
4. **Real-time Distance** - Calculates distance from user's GPS location
5. **Auto-updates** - Updates when new rescues are added

### Information Displayed
Each nearby rescue card shows:
- **Case Number** - Unique identifier (e.g., #RES-1234567890)
- **Distance** - Exact distance in km (e.g., "📍 2.5 km")
- **Animal Type** - Species of the animal
- **Severity** - Visual indicator (🔴 Severe, 🟡 Moderate, 🟢 Minor)
- **Injury Description** - Brief description (truncated to 80 chars)
- **Safety Warnings** - Icons for aggressive (⚠️), on road (🚗), bleeding (🩸)
- **Status** - Current status (Open, In Progress, Resolved)
- **Date** - When the rescue was reported

## User Experience

### For All Users:
- **Quick Overview** - See nearest rescues at a glance
- **Priority Focus** - Most urgent nearby cases highlighted
- **Easy Scanning** - Compact cards for quick information
- **Distance Awareness** - Know exactly how far each rescue is

### For Volunteers:
- **Efficient Response** - Quickly identify nearest cases
- **Route Planning** - See multiple nearby rescues for route optimization
- **Priority Selection** - Choose based on distance and severity

### For Pet Owners:
- **Lost Pet Search** - Check if their pet was reported as a rescue
- **Community Awareness** - See rescue activity in their area

## Technical Implementation

### Location Detection
```typescript
// Uses GPS location from useUserLocation hook
const { location: gpsLocation } = useUserLocation()
```

### Filtering & Sorting
```typescript
rescues
  .filter(rescue => {
    const distance = calculateDistance(userLat, userLon, rescueLat, rescueLon)
    return distance <= 60 // Only within 60km
  })
  .sort((a, b) => distA - distB) // Sort by distance
  .slice(0, 6) // Take top 6
```

### Distance Calculation
- Uses Haversine formula
- Calculates great-circle distance
- Returns distance in kilometers
- Accurate to ~0.1 km

## Visual Hierarchy

1. **Nearby Rescues Section** (Top)
   - Purple gradient background
   - 6 closest rescues in grid
   - Distance badges prominent

2. **All Rescues List** (Below)
   - Complete list of all rescues
   - Detailed information
   - Action buttons for volunteers

## Responsive Design

### Desktop (>768px)
- 2-column grid for nearby rescues
- Sidebar width: 400px
- Compact card layout

### Mobile (<768px)
- 1-column grid for nearby rescues
- Full-width cards
- Stacked layout

## Color Coding

### Status Colors:
- **Open** - Red (#ef4444) - Urgent, needs attention
- **In Progress** - Orange (#f59e0b) - Being handled
- **Resolved** - Green (#10b981) - Completed

### Severity Colors:
- **Severe** - Red circle (🔴)
- **Moderate** - Yellow circle (🟡)
- **Minor** - Green circle (🟢)

### Distance Badge:
- **Green** (#10b981) - Indicates proximity/reachability

## Benefits

### Improved Response Time
- Volunteers can quickly identify nearest cases
- Reduces response time for urgent rescues
- Better resource allocation

### Better User Experience
- Clear visual hierarchy
- Essential information upfront
- Easy to scan and understand

### Enhanced Awareness
- Users see rescue activity in their area
- Encourages community participation
- Promotes faster rescue responses

## Future Enhancements

- [ ] Click card to view on map
- [ ] Filter by severity in nearby section
- [ ] Show route to rescue location
- [ ] Add "Accept" button directly on card
- [ ] Show estimated travel time
- [ ] Add refresh button for nearby rescues
- [ ] Show "No nearby rescues" message when empty
- [ ] Add animation when new rescue appears

## Testing

To test the nearby rescues feature:
1. Allow location access when prompted
2. Create test rescues at various distances
3. Verify only rescues within 60km appear
4. Check sorting (nearest first)
5. Verify only 6 rescues are shown
6. Test with different user locations

---

**Note**: The nearby rescues section only appears when:
- User has granted location permission
- GPS location is successfully detected
- There are rescues in the database
- At least one rescue is within 60km
