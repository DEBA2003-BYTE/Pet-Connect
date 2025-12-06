# PetConnect - Testing Guide

## Prerequisites

Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB (if installed locally)
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

## Step 1: Start the Backend

Open Terminal 1:
```bash
cd backend
bun dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

## Step 2: Start the Frontend

Open Terminal 2:
```bash
cd frontend
bun dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 3: Test the Application

### 3.1 Landing Page
1. Open browser: http://localhost:3000
2. You should see the PetConnect landing page with:
   - Hero section
   - "Report Animal in Need" button
   - "Find Nearby Vet" button
   - "Join as Volunteer" button
   - Feature cards

### 3.2 Sign Up (Create Account)
1. Click "Join as Volunteer" or "Sign up"
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: password123
   - **Phone**: 9876543210
   - **City**: Delhi
   - **Role**: Select "Volunteer" (or any role)
3. Click "Sign Up"
4. You should be redirected to `/dashboard`
5. Check MongoDB to verify user was created:
   ```bash
   mongosh
   use petconnect
   db.users.find().pretty()
   ```

### 3.3 Logout and Login
1. Click "Logout" in the navbar
2. You should be redirected to landing page
3. Click "Login" or go to http://localhost:3000/auth/login
4. Enter credentials:
   - **Email**: john@example.com
   - **Password**: password123
5. Click "Login"
6. You should be redirected to `/dashboard`

### 3.4 Dashboard
After login, you should see:
- Welcome message with your name
- Your role displayed
- Stats cards (Active Rescues, Nearby Services, Lost Pets, Adoptions)
- Navigation bar with all menu items

### 3.5 Test Navigation
Click through each menu item:

1. **Rescue Map** (`/rescue-map`)
   - Should show interactive Leaflet map
   - OpenStreetMap tiles loaded
   - Sample marker visible

2. **Services** (`/nearby-services`)
   - Search bar visible
   - Sample service card displayed

3. **Lost & Found** (`/lost-found`)
   - "Report Lost Pet" and "Report Found Pet" buttons
   - Sample lost pet card

4. **Adoptions** (`/adoptions`)
   - Sample adoption listing
   - "Apply to Adopt" button

5. **Community** (`/community`)
   - "Create Post" button
   - Sample community post

6. **Events** (`/events`)
   - Sample event card
   - "RSVP" button

7. **Profile** (`/profile`)
   - Your name and email displayed
   - Role shown
   - If you're a Volunteer, you'll see "Volunteer Stats" section

## Step 4: Test API Endpoints Directly

### Test Signup API
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "PET_OWNER",
    "phone": "9876543211",
    "city": "Mumbai"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "PET_OWNER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "PetConnect API is running"
}
```

## Step 5: Test Different User Roles

Create accounts with different roles and see role-specific features:

### Pet Owner
- Can manage pets
- Can report lost pets
- Can apply for adoptions

### Volunteer
- Dashboard shows volunteer stats
- Can accept rescue missions
- Earns credits and badges

### NGO/Rescue
- Can create adoption listings
- Can manage rescue reports
- Can organize events

### Veterinarian
- Can list services
- Can provide consultations

### Service Provider
- Can add service locations
- Can manage business listings

## Step 6: Verify MongoDB Data

```bash
mongosh
use petconnect

# Check users
db.users.find().pretty()

# Check collections
show collections
```

## Common Issues & Solutions

### Backend won't start
- **Issue**: MongoDB connection error
- **Solution**: Make sure MongoDB is running
  ```bash
  brew services start mongodb-community  # macOS
  sudo systemctl start mongod            # Linux
  ```

### Frontend shows blank page
- **Issue**: Build errors
- **Solution**: Check browser console for errors
  ```bash
  cd frontend
  bun install
  bun dev
  ```

### Login fails
- **Issue**: User not found or wrong password
- **Solution**: 
  1. Check MongoDB for user: `db.users.find({ email: "your@email.com" })`
  2. Try signing up again with a new email
  3. Check backend logs for errors

### API requests fail (CORS errors)
- **Issue**: Backend not running or wrong port
- **Solution**: 
  1. Ensure backend is running on port 5000
  2. Check Vite proxy config in `frontend/vite.config.ts`

### Map not loading
- **Issue**: Leaflet CSS not loaded
- **Solution**: Check that `index.html` includes Leaflet CSS:
  ```html
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  ```

## Success Criteria ✅

Your application is working correctly if:
- ✅ You can sign up and create an account
- ✅ User is stored in MongoDB with hashed password
- ✅ You can log in with the created account
- ✅ JWT token is generated and stored
- ✅ You're redirected to dashboard after login
- ✅ All navigation links work
- ✅ Rescue map displays with OpenStreetMap
- ✅ You can log out and log back in
- ✅ Protected routes require authentication

## Next Steps

Once basic testing is complete:
1. Test creating rescue reports
2. Test searching for nearby services
3. Test creating lost/found reports
4. Test adoption listings
5. Add real data and test geospatial queries
6. Test image uploads with Cloudinary
7. Test role-based access control

Happy testing! 🎉
