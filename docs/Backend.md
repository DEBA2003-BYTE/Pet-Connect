1. Overview
The PetConnect Backend is a REST (optionally REST + WebSocket) API built on Bun runtime. It stores credentials and domain data in MongoDB, manages cloud uploads via Cloudinary, and exposes secure endpoints for all core features: rescue reporting, services, lost & found, adoptions, community, events, and gamified volunteering.
2. Tech Stack (Backend)
Runtime: Bun (replacing Node.js)
Framework: Express-like framework (Express, Hono, Elysia – any Bun-compatible HTTP framework)
Database: MongoDB (preferably MongoDB Atlas)
ODM: Mongoose or official MongoDB driver
Auth: JWT (access + refresh) with bcrypt for password hashing
Real-Time: WebSockets/Socket.IO or Server-Sent Events for rescue alerts (optional but recommended)
Media Storage: Cloudinary (server-side signature generation and URL management)
Validation: Zod/Joi for payload validation
Config: dotenv / Bun.env
3. Directory Structure (Backend)
backend/
  src/
    server.ts
    config/
      db.ts
      env.ts
      cloudinary.ts
    models/
      User.ts
      Pet.ts
      RescueReport.ts
      ServiceLocation.ts
      LostFound.ts
      AdoptionListing.ts
      HealthRecord.ts
      Event.ts
      Notification.ts
      VolunteerStats.ts
    routes/
      auth.routes.ts
      user.routes.ts
      rescue.routes.ts
      services.routes.ts
      lostFound.routes.ts
      adoption.routes.ts
      health.routes.ts
      community.routes.ts
      events.routes.ts
      admin.routes.ts
      media.routes.ts
    controllers/
      auth.controller.ts
      user.controller.ts
      rescue.controller.ts
      services.controller.ts
      lostFound.controller.ts
      adoption.controller.ts
      health.controller.ts
      community.controller.ts
      events.controller.ts
      admin.controller.ts
      media.controller.ts
    middlewares/
      auth.middleware.ts
      role.middleware.ts
      errorHandler.ts
      validation.middleware.ts
    utils/
      jwt.ts
      password.ts
      geo.ts
      pagination.ts
      logger.ts
    sockets/
      rescue.socket.ts
  package.json / bunfig.toml
  .env
  tsconfig.json (if using TS)
4. Core Data Models (MongoDB)
4.1 User
Fields:
name, email, passwordHash
role: enum (PET_OWNER, NGO, VET, VOLUNTEER, SERVICE_PROVIDER, ADMIN)
phone, city, location (optional GeoJSON point)
isVerified (for NGOs, vets)
createdAt, updatedAt
4.2 Pet
Fields:
ownerId (User ref)
name, species, breed, age, gender
photos (Cloudinary URLs)
notes
4.3 HealthRecord
Fields:
petId (ref Pet)
recordType (vaccination, deworming, prescription, checkup)
date, dueDate (for reminders)
details
vetId (User ref, optional)
4.4 RescueReport
Fields:
reporterId (User ref or null for anonymous)
status: OPEN, ACCEPTED, IN_PROGRESS, RESOLVED, CANCELLED
animalType, injuryDescription
location: GeoJSON Point { type: "Point", coordinates: [lng, lat] }
photos (Cloudinary URLs)
assignedTo (NGO/Volunteer ref)
timestamps: createdAt, updatedAt, resolvedAt
Geospatial index on location for nearby queries.
4.5 ServiceLocation
Fields:
name, type (VET, CLINIC_24X7, GROOMER, TRAINER, PARK, CAFE, BOARDING)
location: GeoJSON Point
address, phone, website
verifiedBy (Admin ref), isVerified
rating, reviewCount
4.6 LostFound
Fields:
ownerId
status: LOST, FOUND, RECOVERED
petType, breed, color, description, uniqueMarks
lastSeenLocation: GeoJSON Point
lastSeenTime
photos (Cloudinary URLs)
aiFeatureVector (optional – for AI photo matching)
createdAt, updatedAt
4.7 AdoptionListing
Fields:
ngoId
petName, species, age, gender
healthInfo, vaccinationStatus
photos (Cloudinary URLs)
location (GeoJSON optional)
status: AVAILABLE, ON_HOLD, ADOPTED
applications ([] with applicantId, message, status)
4.8 CommunityPost & Comment
CommunityPost
authorId, title, content, category, images[], likes[], createdAt.
Comment
postId, authorId, content, createdAt.
4.9 Event
Fields:
createdBy ( NGO/Admin )
title, description, type (meetup, vaccination drive, adoption camp, etc.)
date, startTime, endTime
location (GeoJSON + address)
bannerImage (Cloudinary URL)
4.10 VolunteerStats
Fields:
userId
rescueCount, credits, badges[]
lastRescueAt
5. Auth & Security Design
Registration:
Hash password with bcrypt.
For NGO/Vet roles, require admin verification.
Login:
Issue JWT access token (short-lived) + refresh token (long-lived).
Store refresh token in DB/whitelist (optional) and return via HttpOnly cookie.
Protected Routes:
Middleware verifies access token.
Role-based middleware checks required role(s).
Password Reset:
Email token–based reset or OTP (implementation choice).
Rate Limiting & Basic Security:
Rate limit on:
Login, signup.
Rescue report creation (prevent abuse).
Input validation on all endpoints.
CORS policy restricted to known frontend domains in production.
6. API Design (High-Level)
6.1 Auth
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
6.2 Users & Profile
GET /api/users/me
PUT /api/users/me
GET /api/users/me/stats (for volunteers)
GET /api/users/:id (limited public info)
6.3 Rescue Reports
POST /api/rescues – create rescue report
GET /api/rescues/nearby – query by location & radius (uses Mongo geospatial)
GET /api/rescues/:id
PATCH /api/rescues/:id – update status, assign volunteer (role-based)
Real-time channel:
ws://.../rescues or /api/rescues/stream (SSE) – push alerts to nearby volunteers/NGOs.
6.4 Service Locations
GET /api/services/nearby
POST /api/services (admin/verified providers)
PATCH /api/services/:id (admin/provider)
GET /api/services/types – enumerated list.
6.5 Lost & Found
POST /api/lost-found – create lost/found entry
GET /api/lost-found – list with filters (status, city, radius, pet type)
GET /api/lost-found/:id
PATCH /api/lost-found/:id – update details or mark as recovered
(Optional) POST /api/lost-found/match – AI-assisted image matching (future scope).
6.6 Adoption
POST /api/adoptions – create listing (NGO)
GET /api/adoptions
GET /api/adoptions/:id
PATCH /api/adoptions/:id – update/mark adopted (NGO)
POST /api/adoptions/:id/apply – submit adoption request.
6.7 Health Records
POST /api/health/pets – create pet profile
GET /api/health/pets
POST /api/health/records – add vaccination/deworming/consultation
GET /api/health/records?petId=...
PATCH /api/health/records/:id
6.8 Community & Events
POST /api/community/posts
GET /api/community/posts
POST /api/community/posts/:id/comments
POST /api/community/posts/:id/like
POST /api/events
GET /api/events
6.9 Media (Cloudinary Integration)
GET /api/media/signature – returns signature & timestamp for secure client upload (if using signed uploads).
(Or) POST /api/media/upload – backend receives file and uploads to Cloudinary server-side (if desired).
6.10 Admin
GET /api/admin/users – user management
PATCH /api/admin/users/:id/verify – verify NGOs/vets
GET /api/admin/dashboard – high-level stats (no of rescues, resolved, etc.).
7. Cloudinary Integration (Backend)
Configure Cloudinary credentials in cloudinary.ts.
Provide either:
Signed upload endpoint that frontend uses to upload directly to Cloudinary.
Or direct server-side upload endpoint where backend accepts file and forwards to Cloudinary.
Store only public_id and secure_url in MongoDB.
8. Geospatial & Map Logic
Use MongoDB 2dsphere indices on location fields in:
RescueReport, ServiceLocation, LostFound, Event.
GET /nearby endpoints accept:
lat, lng, radiusInKm query params.
Backend converts radius to meters and performs $geoNear or $near queries.
Results directly correspond to markers plotted on Leaflet in the frontend.