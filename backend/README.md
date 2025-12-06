# PetConnect Backend

Bun + Express + MongoDB backend for PetConnect platform.

## Features

- JWT authentication with role-based access
- Geospatial queries for rescue reports and services
- RESTful API endpoints
- MongoDB with Mongoose ODM
- Cloudinary integration for image uploads

## Tech Stack

- Bun runtime
- Express
- MongoDB + Mongoose
- JWT + bcrypt
- Cloudinary

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
- MongoDB URI
- JWT secrets
- Cloudinary credentials

4. Start development server:
```bash
bun dev
```

The API will run on http://localhost:5000

## API Endpoints

### Auth
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user

### Rescue Reports
- POST `/api/rescues` - Create rescue report
- GET `/api/rescues/nearby?lat=X&lng=Y&radius=10` - Get nearby rescues
- GET `/api/rescues/:id` - Get rescue details
- PATCH `/api/rescues/:id` - Update rescue status

### Services
- GET `/api/services/nearby?lat=X&lng=Y&type=VET` - Get nearby services
- GET `/api/services/types` - Get service types

### Lost & Found
- POST `/api/lost-found` - Create lost/found report
- GET `/api/lost-found?status=LOST` - List lost/found pets
- PATCH `/api/lost-found/:id` - Update report

### Adoptions
- POST `/api/adoptions` - Create adoption listing (NGO only)
- GET `/api/adoptions` - List available pets
- POST `/api/adoptions/:id/apply` - Apply for adoption

## Database Setup

Make sure MongoDB is running locally or use MongoDB Atlas. The app will automatically create the database and collections on first run.
