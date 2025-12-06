# Quick Authentication Test Guide

## Prerequisites
- MongoDB running on `mongodb://localhost:27017`
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`

## Test Scenarios

### 1. User Registration (Signup)
**URL:** `http://localhost:5173/auth/signup`

**Test Data:**
```
Name: John Doe
Email: john@example.com
Password: password123
Confirm Password: password123
Phone: +1234567890
City: New York
Role: Pet Owner
```

**Expected Result:**
- User created in MongoDB
- JWT token generated
- Redirected to `/dashboard`
- User info stored in localStorage

### 2. User Login
**URL:** `http://localhost:5173/auth/login`

**Test Data:**
```
Email: john@example.com
Password: password123
```

**Expected Result:**
- JWT token generated
- Redirected to `/dashboard`
- User info stored in localStorage

### 3. View Profile
**URL:** `http://localhost:5173/profile`

**Expected Result:**
- Display user information
- Show role badge with color
- Display member since date
- Show verification status

### 4. Edit Profile
**Steps:**
1. Go to Profile page
2. Click "Edit Profile"
3. Update name, phone, or city
4. Click "Save Changes"

**Expected Result:**
- Profile updated in MongoDB
- Success message displayed
- Updated info shown immediately

### 5. Change Password
**Steps:**
1. Go to Profile page
2. Click "Change Password"
3. Enter current password
4. Enter new password (min 6 chars)
5. Confirm new password
6. Click "Update Password"

**Expected Result:**
- Password updated in MongoDB
- Success message displayed
- Can login with new password

### 6. Protected Routes
**Test:**
1. Logout from profile page
2. Try to access `/dashboard` directly

**Expected Result:**
- Redirected to `/auth/login`
- Cannot access protected routes without authentication

### 7. Logout
**Steps:**
1. Click "Logout" button in profile page

**Expected Result:**
- User data cleared from localStorage
- Token removed
- Redirected to login page

## MongoDB Verification

Check users in MongoDB:
```bash
mongosh
use petconnect
db.users.find().pretty()
```

## API Testing with curl

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "PET_OWNER",
    "phone": "+1234567890",
    "city": "New York"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (replace TOKEN with actual JWT)
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/users/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+9876543210",
    "city": "Los Angeles"
  }'
```

## Common Issues

### Issue: "No token provided"
**Solution:** Make sure you're logged in and token is in localStorage

### Issue: "Invalid credentials"
**Solution:** Check email and password are correct

### Issue: "User already exists"
**Solution:** Use a different email or login with existing account

### Issue: "Passwords do not match"
**Solution:** Ensure password and confirm password are identical

### Issue: MongoDB connection error
**Solution:** Start MongoDB with `mongod` or check connection string

## Role-Based Features

Different roles see different features:

- **PET_OWNER**: Basic profile
- **VOLUNTEER**: Profile + Volunteer Stats section
- **NGO**: Profile (can be extended with organization info)
- **VET**: Profile (can be extended with clinic info)
- **SERVICE_PROVIDER**: Profile (can be extended with services)

## Next: Test Other Features

After authentication works:
1. Test Rescue Map
2. Test Lost & Found
3. Test Adoption Listings
4. Test Nearby Services
5. Test Community Features
