# PetConnect Authentication Flow

## 🔐 Complete Authentication System

### User Journey

```
Landing Page (/)
    ↓
    ├─→ Click "Login" → Login Page (/auth/login)
    │                      ↓
    │                   Enter credentials
    │                      ↓
    │                   JWT Token Generated
    │                      ↓
    └─→ Click "Sign Up" → Signup Page (/auth/signup)
                             ↓
                          Fill registration form
                             ↓
                          User created in MongoDB
                             ↓
                          JWT Token Generated
                             ↓
                          ↓
                    Dashboard (/dashboard)
                          ↓
                    Protected Routes
                    - Rescue Map
                    - Lost & Found
                    - Adoptions
                    - Profile
                    - etc.
```

## 📁 File Structure

### Backend
```
backend/src/
├── models/
│   └── User.ts                    # MongoDB User schema
├── routes/
│   ├── auth.routes.ts            # Login & Signup endpoints
│   └── user.routes.ts            # Profile management endpoints
├── middlewares/
│   └── auth.middleware.ts        # JWT verification
├── utils/
│   └── jwt.ts                    # Token generation/verification
└── server.ts                     # Route registration
```

### Frontend
```
frontend/src/
├── routes/
│   ├── Auth/
│   │   ├── Login.tsx             # Login page
│   │   ├── Signup.tsx            # Signup page
│   │   └── Auth.css              # Auth pages styling
│   ├── Profile/
│   │   ├── Profile.tsx           # User profile page
│   │   └── Profile.css           # Profile styling
│   └── Landing/
│       └── Landing.tsx           # Updated with auth links
├── components/
│   └── ProtectedRoute.tsx        # Route protection
├── context/
│   └── AuthContext.tsx           # Global auth state
├── services/
│   └── api.ts                    # API client with JWT
└── App.tsx                       # Route configuration
```

## 🔄 Authentication Flow Details

### 1. Signup Process
```
User fills form → Frontend validates → POST /api/auth/signup
                                              ↓
                                    Check if user exists
                                              ↓
                                    Hash password (bcrypt)
                                              ↓
                                    Save to MongoDB
                                              ↓
                                    Generate JWT token
                                              ↓
                                    Return user + token
                                              ↓
Frontend stores token → Redirect to dashboard
```

### 2. Login Process
```
User enters credentials → POST /api/auth/login
                                ↓
                        Find user by email
                                ↓
                        Verify password (bcrypt)
                                ↓
                        Generate JWT token
                                ↓
                        Return user + token
                                ↓
Frontend stores token → Redirect to dashboard
```

### 3. Protected Route Access
```
User navigates to protected route
            ↓
    ProtectedRoute checks auth
            ↓
    ┌───────┴───────┐
    │               │
Authenticated   Not Authenticated
    │               │
    ↓               ↓
Allow access   Redirect to /auth/login
```

### 4. API Request with Auth
```
Frontend makes API call
        ↓
api.ts interceptor adds token
        ↓
Request sent with Authorization header
        ↓
Backend auth middleware verifies token
        ↓
    ┌───────┴───────┐
    │               │
Valid Token    Invalid Token
    │               │
    ↓               ↓
Process req    Return 401 error
```

## 🎨 UI Components

### Login Page Features
- Email input field
- Password input field
- Error message display
- Loading state during login
- Link to signup page
- Gradient background
- Smooth animations

### Signup Page Features
- Name input
- Email input
- Password input
- Confirm password input
- Phone input (optional)
- City input (optional)
- Role selection dropdown
- Password validation
- Error handling
- Loading state
- Link to login page

### Profile Page Features
- User avatar with initial
- Role badge with color coding
- Profile information display
- Edit profile form
- Change password form
- Logout button
- Volunteer stats (for volunteers)
- Responsive design

## 🎯 Role System

### Available Roles
1. **PET_OWNER** (Blue badge)
   - Default role
   - Can report lost pets
   - Can browse adoptions

2. **VOLUNTEER** (Green badge)
   - Can respond to rescue requests
   - Has volunteer stats section
   - Earns credits and badges

3. **NGO** (Purple badge)
   - Can post adoption listings
   - Manage rescue operations
   - Verified organizations

4. **VET** (Orange badge)
   - Listed in nearby services
   - Can provide medical advice
   - Clinic information

5. **SERVICE_PROVIDER** (Pink badge)
   - Pet services (grooming, training, etc.)
   - Listed in nearby services
   - Business profile

## 🔒 Security Features

### Password Security
- Minimum 6 characters
- Hashed with bcryptjs (10 rounds)
- Never stored in plain text
- Secure password change flow

### Token Security
- JWT with 1-day expiration
- Stored in localStorage
- Sent in Authorization header
- Verified on every protected request

### Route Protection
- All dashboard routes protected
- Automatic redirect to login
- Token validation on backend
- Middleware-based security

## 📊 MongoDB Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: Enum,
  phone: String,
  city: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Quick Start

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend**
   ```bash
   cd backend
   bun run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   bun run dev
   ```

4. **Test Authentication**
   - Visit http://localhost:5173
   - Click "Sign Up"
   - Create an account
   - Explore the dashboard
   - Visit profile page
   - Try editing profile
   - Test password change
   - Logout and login again

## 🎨 Design Highlights

- **Gradient Backgrounds**: Purple to blue gradient for auth pages
- **Smooth Animations**: Slide-up animation on page load
- **Color-Coded Roles**: Each role has a unique color
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during async operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side and server-side validation

## 📝 API Documentation

### POST /api/auth/signup
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PET_OWNER",
  "phone": "+1234567890",
  "city": "New York"
}

Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PET_OWNER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/login
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PET_OWNER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /api/users/me (Protected)
```json
Headers:
{
  "Authorization": "Bearer <token>"
}

Response:
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PET_OWNER",
  "phone": "+1234567890",
  "city": "New York",
  "isVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## ✅ Testing Checklist

- [ ] User can signup with valid data
- [ ] Duplicate email shows error
- [ ] Password validation works
- [ ] User can login with correct credentials
- [ ] Wrong password shows error
- [ ] Token is stored in localStorage
- [ ] Protected routes redirect when not logged in
- [ ] User can view profile
- [ ] User can edit profile
- [ ] User can change password
- [ ] User can logout
- [ ] Role badge displays correctly
- [ ] Responsive design works on mobile

## 🎯 Next Steps

1. Add email verification
2. Implement forgot password
3. Add profile picture upload
4. Social login (Google, Facebook)
5. Two-factor authentication
6. Admin dashboard
7. User activity logs
8. Account deletion
