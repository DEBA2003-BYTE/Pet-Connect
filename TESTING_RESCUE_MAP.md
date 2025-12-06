# 🧪 Testing Guide: Enhanced Rescue Map

## Prerequisites
- Backend running on port 5001
- Frontend running on port 3000
- MongoDB Atlas connected
- Cloudinary configured in `.env`
- User logged in

## Test Scenarios

### 1. Auto-Detect Location
**Steps:**
1. Navigate to Rescue Map
2. Click "Report Injured Animal"
3. Click "📍 Use Current Location" button
4. Browser should prompt for location permission
5. After allowing, map should center on your location
6. A draggable marker should appear

**Expected:**
- Location detected within 2-3 seconds
- Map centers on your coordinates
- Address preview shows coordinates
- Marker is draggable

### 2. Manual Location Selection
**Steps:**
1. Click "Report Injured Animal"
2. Click anywhere on the map
3. Marker should appear at clicked location
4. Drag the marker to adjust position

**Expected:**
- Marker appears on click
- Marker is draggable
- Coordinates update in address preview
- Form data updates with new coordinates

### 3. Complete Rescue Report
**Steps:**
1. Fill in all fields:
   - Animal Type: Dog
   - Injury Description: "Hit by car, bleeding from leg, appears to have fracture"
   - Severity: SEVERE
   - Safety Warnings: Check "On busy road" and "Bleeding heavily"
   - Contact Number: Your phone
   - Upload 1-3 photos
   - Check "Report anonymously" (optional)
2. Select location on map
3. Click "Submit Report"

**Expected:**
- Success alert with case number (e.g., RC-2024-00001)
- Alert shows severity, tags (#hitAndRun, #fracture)
- If night time (7PM-6AM), shows night emergency message
- Form resets after submission
- New rescue appears in the list

### 4. View Rescue List
**Steps:**
1. Check the rescue list on the left sidebar
2. Look for your newly created rescue

**Expected Display:**
- Case number (#RC-2024-00001)
- Animal type and severity badge (color-coded)
- Injury description
- Safety warning tags (if any)
- Address or coordinates
- Distance from your location
- Reporter name or "Anonymous"
- Timestamp

### 5. Photo Upload
**Steps:**
1. In the form, click "Click to upload image"
2. Select an image (< 5MB)
3. Wait for upload to complete
4. Repeat for up to 3 photos
5. Click X button to remove a photo

**Expected:**
- Upload progress indicator
- Image preview after upload
- Grid display of uploaded images
- Remove button works
- Max 3 images enforced

### 6. Night Mode Detection
**Steps:**
1. Change system time to 8:00 PM (or wait until night)
2. Open rescue report form
3. Look for night alert

**Expected:**
- Blue alert box appears: "🌙 Night Emergency Detected - 24/7 NGOs will be prioritized"
- Alert is visible before submit button

### 7. Intelligent Tags
**Steps:**
1. Create reports with different injury descriptions:
   - "Dog with broken leg" → should generate #fracture
   - "Cat hit by vehicle" → should generate #hitAndRun
   - "Abandoned puppy found" → should generate #abandonedPuppy
   - "Cow electrocuted by wire" → should generate #electrocution, #injuredCow

**Expected:**
- Success alert shows generated tags
- Tags are relevant to description keywords

### 8. Severity Badges
**Steps:**
1. Create 3 reports with different severities
2. Check the rescue list

**Expected Colors:**
- MINOR: Green badge
- MODERATE: Yellow badge
- SEVERE: Red badge

### 9. Distance Calculation
**Steps:**
1. Allow location access
2. View rescue list
3. Check distance shown for each rescue

**Expected:**
- Distance shown in km (e.g., "2.3 km")
- Distance is relative to your current location
- If location not available, shows "N/A"

### 10. Map Markers
**Steps:**
1. View the map
2. Look for markers representing rescues
3. Click on a marker

**Expected:**
- Each rescue has a marker at its location
- Clicking marker shows popup with:
  - Animal type
  - Status
  - Injury description
  - Reporter name
  - Timestamp

## API Endpoints to Test

### Create Rescue Report
```bash
POST http://localhost:5001/api/rescues
Headers: Authorization: Bearer <token>
Body: {
  "animalType": "Dog",
  "injuryDescription": "Hit by car, bleeding",
  "severity": "SEVERE",
  "location": {
    "coordinates": [77.2090, 28.6139]
  },
  "address": "Near India Gate",
  "photos": ["https://cloudinary.com/..."],
  "contactNumber": "9876543210",
  "safetyWarnings": {
    "isAggressive": false,
    "onRoad": true,
    "isBleeding": true
  }
}
```

### Get Nearby Rescues
```bash
GET http://localhost:5001/api/rescues/nearby?lat=28.6139&lng=77.2090&radius=10
```

### Get Single Rescue
```bash
GET http://localhost:5001/api/rescues/<rescue_id>
```

### Update Rescue Status
```bash
PATCH http://localhost:5001/api/rescues/<rescue_id>
Headers: Authorization: Bearer <token>
Body: {
  "status": "ACCEPTED",
  "assignedTo": "<user_id>"
}
```

## Common Issues & Solutions

### Issue: Location not detected
**Solution:** 
- Check browser permissions
- Try HTTPS (geolocation requires secure context)
- Use manual map selection as fallback

### Issue: Photos not uploading
**Solution:**
- Check Cloudinary credentials in `.env`
- Verify image size < 5MB
- Check network tab for API errors

### Issue: Case number not showing
**Solution:**
- Check backend logs
- Verify MongoDB connection
- Check rescue.routes.ts case number generation

### Issue: Distance shows "N/A"
**Solution:**
- Allow location access
- Check if userLocation state is set
- Verify coordinates are in correct format [lng, lat]

### Issue: Tags not generating
**Solution:**
- Check injury description contains keywords
- Verify generateTags() function logic
- Check success alert for tags array

## Performance Checks

1. **Map Load Time**: Should load within 2 seconds
2. **Location Detection**: Should complete within 3 seconds
3. **Photo Upload**: Should complete within 5 seconds per image
4. **Form Submission**: Should complete within 2 seconds
5. **Rescue List Update**: Should refresh immediately after submission

## Mobile Testing

Test on mobile devices:
- Touch interactions with map
- Dragging marker with finger
- Photo upload from camera
- GPS location detection
- Responsive layout

## Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Testing

1. Try submitting without authentication → Should fail
2. Try uploading file > 5MB → Should show error
3. Try uploading non-image file → Should show error
4. Try submitting without location → Should show alert

## Success Criteria

✅ All form fields work correctly
✅ Location detection works
✅ Photos upload successfully
✅ Case numbers are unique
✅ Tags are generated intelligently
✅ Night mode is detected
✅ Distance is calculated correctly
✅ Rescue list displays all info
✅ Map markers are clickable
✅ Anonymous reporting works
✅ Safety warnings display correctly
✅ Severity badges show correct colors

## Next Steps After Testing

1. Fix any bugs found
2. Implement remaining features (NGOs on map, case history)
3. Add real-time updates
4. Optimize performance
5. Deploy to production
