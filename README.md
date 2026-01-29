# 🐾 PetConnect – Unified Pet & Street Animal Welfare Platform

## 📌 Description

**PetConnect** is a comprehensive community-driven platform that transforms India's fragmented pet and street animal ecosystem into a unified digital solution. It connects citizens, NGOs, veterinarians, volunteers, and service providers to ensure timely care, safety, and better quality of life for both pets and street animals.

**The Problem:**
- 🚨 Injured street animals go unreported and unrescued
- 🏥 Pet owners struggle to find nearby veterinary services
- 🐕 Lost pets have low reunion rates due to lack of centralized systems
- ❤️ Adoption opportunities are scattered and hard to discover
- 📋 Pet health records are fragmented across multiple providers
- 🤝 No unified platform for community collaboration

**The Solution:**
PetConnect implements a **mobile-first, geospatial platform** that:
- ✅ Enables real-time rescue reporting with interactive maps
- ✅ Provides location-based discovery of pet services
- ✅ Streamlines lost & found pet workflows with photo uploads
- ✅ Connects verified NGOs with potential adopters
- ✅ Maintains digital pet health records for continuity of care
- ✅ Gamifies volunteer participation to encourage civic engagement

---

## ✨ Core Features

### 🚨 Real-Time Rescue Map
- **Interactive Geospatial Reporting** – Report injured street animals with location pins
- **OpenStreetMap Integration** – Leaflet.js with clustered markers for better visualization
- **Status Tracking** – Monitor rescue progress (Open → Accepted → In Progress → Resolved)
- **Volunteer Alerts** – Nearby volunteers and NGOs receive notifications
- **Photo Documentation** – Cloudinary-powered image uploads for injury assessment
- **Navigation Support** – Direct links to Google Maps for rescue navigation

### 🏥 Nearby Services Locator
- **Geospatial Search** – Find vets, clinics, groomers, trainers, parks, and pet cafés
- **Radius-Based Filtering** – Search within customizable distance ranges
- **Service Categories:**
  - 🏥 Veterinary Clinics
  - 🌙 24/7 Emergency Hospitals
  - ✂️ Groomers & Spas
  - 🎓 Training Centers
  - 🏞️ Pet-Friendly Parks
  - ☕ Pet Cafés
  - 🏨 Boarding & Daycare
- **Verified Badges** – Admin-verified service providers
- **Contact Integration** – Direct call/email from listings

### 🐕 Lost & Found Pet System
- **Public Listings** – Searchable database of lost and found pets
- **Advanced Filters** – Search by species, breed, color, location, date
- **Photo Uploads** – Multiple images with Cloudinary storage
- **Last Seen Location** – Geospatial tracking with map visualization
- **Status Management** – Mark as Lost, Found, or Recovered
- **AI-Ready Architecture** – Prepared for future photo-matching features

### ❤️ Adoption & Foster Network
- **NGO Dashboard** – Verified NGOs can create adoption listings
- **Pet Profiles** – Detailed information including health status and vaccinations
- **Application System** – Users can apply to adopt with messaging
- **Status Workflow** – Available → On Hold → Adopted
- **Photo Galleries** – Multiple images per adoptable pet
- **Transparency** – Public visibility of adoption opportunities

### 📋 Digital Pet Health Records
- **Pet Profiles** – Manage multiple pets with detailed information
- **Health Timeline** – Track vaccinations, deworming, checkups, prescriptions
- **Reminder System** – Upcoming vaccination and health check alerts
- **Vet Integration** – Link health records to veterinary visits
- **Document Storage** – Upload and store medical documents
- **Continuity of Care** – Portable health history across providers

### 👥 Community Forum
- **Discussion Categories:**
  - 💊 Health & Care
  - 🎓 Training & Behavior
  - ❤️ Adoption Stories
  - 🚨 Rescue Alerts
  - 💬 General Discussion
- **Post Creation** – Text + image support
- **Comment Threads** – Nested discussions
- **Engagement** – Likes, upvotes, and sharing
- **Moderation Tools** – Admin and NGO moderation capabilities

### 📅 Events & Activities
- **Event Types:**
  - 🐾 Pet Meetups
  - 💉 Vaccination Drives
  - ❤️ Adoption Camps
  - 📢 Awareness Programs
- **Calendar View** – Visual event scheduling
- **RSVP System** – Track attendance and interest
- **Location-Based** – Find events near you
- **NGO/Admin Creation** – Verified organizations can host events

### 🏆 Gamified Volunteer System
- **Credit System** – Earn points for rescue participation
- **Badge Achievements:**
  - 🥉 Bronze Rescuer (10 rescues)
  - 🥈 Silver Rescuer (25 rescues)
  - 🥇 Gold Rescuer (50 rescues)
  - 💎 Diamond Rescuer (100 rescues)
- **Leaderboards** – Community recognition for top volunteers
- **Rescue History** – Track personal impact and contributions
- **Volunteer Dashboard** – Personalized stats and achievements

---

## 🛠️ Tech Stack

### 🌐 Frontend (React SPA)
- **React 19** – Modern UI library with hooks
- **Vite** – Lightning-fast build tool and dev server
- **React Router** – Client-side routing
- **React Query** – Server state management and caching
- **React Hook Form + Zod** – Form handling and validation
- **Leaflet.js + React-Leaflet** – Interactive maps with OpenStreetMap
- **Axios** – HTTP client for API requests
- **TypeScript** – Type-safe development

### ⚙️ Backend (Bun Runtime)
- **Bun** – Fast JavaScript runtime (replaces Node.js)
- **Express** – Web framework for REST APIs
- **MongoDB + Mongoose** – NoSQL database with ODM
- **JWT (jsonwebtoken)** – Stateless authentication
- **bcryptjs** – Password hashing and security
- **Cloudinary SDK** – Image upload and management
- **dotenv** – Environment configuration

### 🗄️ Database & Storage
- **MongoDB Atlas** – Cloud-hosted NoSQL database
- **Geospatial Indices** – 2dsphere indices for location queries
- **Cloudinary** – Cloud-based image storage and CDN
- **AWS S3-Ready** – Architecture supports S3 migration

### 🔐 Security & Authentication
- **JWT Tokens** – Secure, stateless session management
- **bcrypt Hashing** – Industry-standard password encryption
- **Role-Based Access Control (RBAC):**
  - 👤 Pet Owner
  - 🏢 NGO/Rescue Organization
  - 🏥 Veterinarian
  - 🤝 Volunteer
  - 🏪 Service Provider
  - 👨‍💼 Admin
- **CORS** – Cross-origin resource sharing control
- **Input Validation** – Server-side validation with Zod

### 📡 Integrations
- **OpenStreetMap** – Free, open-source mapping tiles
- **Nominatim API** – Reverse geocoding (coordinates → addresses)
- **Cloudinary API** – Image upload, transformation, and delivery
- **Geolocation API** – Browser-based location tracking

---

## 🚀 Getting Started

### Prerequisites
- ✅ **Bun** (v1.0+) – [Install](https://bun.sh/)
- ✅ **MongoDB Atlas Account** – [Sign Up](https://www.mongodb.com/cloud/atlas)
- ✅ **Cloudinary Account** – [Sign Up](https://cloudinary.com/)
- ✅ **Git** – [Download](https://git-scm.com/)

### Quick Start (3 Steps)

#### Step 1: Clone Repository
```bash
git clone https://github.com/DEBA2003-BYTE/Pet-Connect.git
cd Pet-Connect
```

#### Step 2: Setup Backend
```bash
cd backend

# Install dependencies
bun install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - JWT Secret
# - Cloudinary credentials

# Start backend server
bun dev
```

Backend runs on `http://localhost:5000`

#### Step 3: Setup Frontend
```bash
cd frontend

# Install dependencies
bun install

# Start development server
bun dev
```

Frontend runs on `http://localhost:3000`

### Quick Setup Guides

**MongoDB Atlas:**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with read/write permissions
3. Whitelist IP address (0.0.0.0/0 for development)
4. Get connection string from "Connect" → "Connect your application"
5. Replace `<password>` and add to `MONGODB_URI`

**Cloudinary:**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env` file

**JWT Secret:**
```bash
# Generate secure random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📚 API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user with role selection |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/auth/refresh` | Refresh expired access token |
| POST | `/api/auth/logout` | Logout and invalidate token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### User APIs (Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update user profile |
| GET | `/api/users/me/stats` | Get volunteer statistics |
| GET | `/api/users/:id` | Get public user info |

### Rescue Report APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rescues` | Create rescue report |
| GET | `/api/rescues/nearby?lat=X&lng=Y&radius=10` | Get nearby rescues |
| GET | `/api/rescues/:id` | Get rescue details |
| PATCH | `/api/rescues/:id` | Update rescue status |
| POST | `/api/rescues/:id/accept` | Volunteer accepts rescue |

### Service Location APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/nearby?lat=X&lng=Y&type=VET` | Get nearby services |
| GET | `/api/services/types` | Get all service types |
| POST | `/api/services` | Create service (admin/provider) |
| PATCH | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

### Lost & Found APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/lost-found` | Create lost/found report |
| GET | `/api/lost-found?status=LOST` | List lost/found pets |
| GET | `/api/lost-found/:id` | Get report details |
| PATCH | `/api/lost-found/:id` | Update report |
| DELETE | `/api/lost-found/:id` | Delete report |

### Adoption APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/adoptions` | Create adoption listing (NGO) |
| GET | `/api/adoptions` | List available pets |
| GET | `/api/adoptions/:id` | Get adoption details |
| PATCH | `/api/adoptions/:id` | Update listing (NGO) |
| POST | `/api/adoptions/:id/apply` | Apply for adoption |

### Health Record APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/health/pets` | Create pet profile |
| GET | `/api/health/pets` | Get user's pets |
| POST | `/api/health/records` | Add health record |
| GET | `/api/health/records?petId=X` | Get pet's health records |
| PATCH | `/api/health/records/:id` | Update health record |

### Community APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/community/posts` | Create post |
| GET | `/api/community/posts` | List posts |
| GET | `/api/community/posts/:id` | Get post details |
| POST | `/api/community/posts/:id/comments` | Add comment |
| POST | `/api/community/posts/:id/like` | Like/unlike post |

### Event APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create event (NGO/admin) |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get event details |
| PATCH | `/api/events/:id` | Update event |
| POST | `/api/events/:id/rsvp` | RSVP to event |

### Admin APIs (Requires Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id/verify` | Verify NGO/vet |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/dashboard` | Get system statistics |

**Total: 45+ API Endpoints**

---

## 🗺️ Geospatial Features

### MongoDB Geospatial Queries
PetConnect uses MongoDB's powerful geospatial capabilities:

```javascript
// 2dsphere index for location-based queries
location: {
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true } // [longitude, latitude]
}
```

### Haversine Distance Calculation
```javascript
// Find rescues within 10km radius
db.rescueReports.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 10000 // meters
    }
  }
})
```

### Map Clustering
- **Leaflet.markercluster** – Groups nearby markers for better performance
- **Dynamic Zoom** – Clusters expand as user zooms in
- **Color Coding:**
  - 🔴 Red – Open rescue reports
  - 🟡 Yellow – In-progress rescues
  - 🟢 Green – Resolved rescues
  - 🔵 Blue – Service locations

---

## 📁 Project Structure

```
Pet-Connect/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                  # MongoDB connection
│   │   │   └── cloudinary.ts          # Cloudinary config
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts     # JWT verification
│   │   ├── models/
│   │   │   ├── User.ts                # User schema
│   │   │   ├── Pet.ts                 # Pet profile schema
│   │   │   ├── RescueReport.ts        # Rescue report schema
│   │   │   ├── ServiceLocation.ts     # Service location schema
│   │   │   ├── LostFound.ts           # Lost & found schema
│   │   │   ├── AdoptionListing.ts     # Adoption schema
│   │   │   ├── Post.ts                # Community post schema
│   │   │   ├── Event.ts               # Event schema
│   │   │   ├── Order.ts               # E-commerce order
│   │   │   ├── Product.ts             # Pet products
│   │   │   ├── Cart.ts                # Shopping cart
│   │   │   ├── Wishlist.ts            # User wishlist
│   │   │   ├── Follow.ts              # User follows
│   │   │   ├── Feedback.ts            # User feedback
│   │   │   └── AccessLog.ts           # Audit logs
│   │   ├── routes/
│   │   │   ├── auth.routes.ts         # Auth endpoints
│   │   │   ├── user.routes.ts         # User endpoints
│   │   │   ├── rescue.routes.ts       # Rescue endpoints
│   │   │   ├── services.routes.ts     # Service endpoints
│   │   │   ├── lostFound.routes.ts    # Lost & found endpoints
│   │   │   ├── adoption.routes.ts     # Adoption endpoints
│   │   │   ├── health.routes.ts       # Health record endpoints
│   │   │   ├── community.routes.ts    # Community endpoints
│   │   │   └── events.routes.ts       # Event endpoints
│   │   ├── utils/
│   │   │   ├── jwt.ts                 # JWT utilities
│   │   │   ├── password.ts            # Password hashing
│   │   │   ├── geo.ts                 # Geospatial utilities
│   │   │   └── pagination.ts          # Pagination helper
│   │   └── server.ts                  # Express server
│   ├── .env.example                   # Environment template
│   ├── package.json                   # Dependencies
│   └── tsconfig.json                  # TypeScript config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                # Layout components
│   │   │   ├── map/                   # Map components
│   │   │   ├── forms/                 # Form components
│   │   │   └── common/                # Reusable components
│   │   ├── routes/
│   │   │   ├── Landing/               # Landing page
│   │   │   ├── Auth/                  # Login/Signup
│   │   │   ├── Dashboard/             # User dashboard
│   │   │   ├── RescueMap/             # Rescue map view
│   │   │   ├── NearbyServices/        # Services locator
│   │   │   ├── LostFound/             # Lost & found
│   │   │   ├── Adoption/              # Adoption listings
│   │   │   ├── Community/             # Forum
│   │   │   ├── Events/                # Events calendar
│   │   │   └── Profile/               # User profile
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── context/                   # React context
│   │   ├── services/                  # API services
│   │   ├── styles/                    # CSS files
│   │   ├── App.tsx                    # Root component
│   │   └── main.tsx                   # Entry point
│   ├── index.html                     # HTML template
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── vite.config.ts                 # Vite configuration
├── docs/
│   ├── Plan.md                        # Project vision & roadmap
│   ├── Backend.md                     # Backend architecture
│   └── Frontend.md                    # Frontend architecture
└── README.md                          # This file
```

---

## 🔒 Security & Compliance

### Security Features
- ✅ **JWT Authentication** – Stateless, secure token-based auth
- ✅ **bcrypt Hashing** – Password encryption with salt rounds
- ✅ **Role-Based Access Control** – 6 distinct user roles
- ✅ **Input Validation** – Zod schema validation on all inputs
- ✅ **CORS Protection** – Restricted cross-origin access
- ✅ **XSS Prevention** – Input sanitization
- ✅ **HTTPS Ready** – Secure data transmission in production
- ✅ **Rate Limiting** – Prevent API abuse (planned)

### Data Privacy
- ✅ **Minimal Data Collection** – Only essential information
- ✅ **User Consent** – Clear privacy policy and terms
- ✅ **Data Portability** – Users can export their data
- ✅ **Right to Deletion** – Users can delete accounts
- ✅ **Secure Storage** – Encrypted passwords, secure tokens

### Compliance Standards
- ✅ **GDPR** – Data minimization and user rights
- ✅ **OWASP** – Security best practices
- ✅ **Accessibility** – WCAG 2.1 guidelines (in progress)

---
