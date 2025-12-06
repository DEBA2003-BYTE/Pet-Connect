# 🎉 Events & Profile System - Implementation Guide

## 📋 Overview

A complete system for managing pet events (competitions, vaccination drives, etc.) and enhanced user profiles with pets and event participation tracking.

## ✅ Backend Implementation Complete

### Models Created

#### 1. Event Model (`backend/src/models/Event.ts`)
```typescript
- organizerId: Who created the event
- title, description: Event details
- type: COMPETITION | VACCINATION_DRIVE | ADOPTION_CAMP | WORKSHOP | MEETUP | OTHER
- images: Event photos (Cloudinary URLs)
- location: Geospatial coordinates
- address, venue: Location details
- startDate, endDate: Event dates
- startTime, endTime: Event timings
- registrationDeadline: Last date to register
- maxParticipants: Capacity limit
- registrationFee: Cost to participate
- requirements: What participants need
- prizes: For competitions
- agenda: Event schedule
- contactEmail, contactPhone: Organizer contact
- registrations: Array of registered users
- isActive, isFeatured: Status flags
```

#### 2. Pet Model (`backend/src/models/Pet.ts`)
```typescript
- ownerId: Pet owner
- name: Pet's name
- species: DOG | CAT | BIRD | RABBIT | OTHER
- breed, age, gender, color, weight: Details
- photos: Pet photos (Cloudinary URLs)
- medicalHistory: Health records
- vaccinations: Vaccination records
- microchipId: Identification
- description: About the pet
```

### API Endpoints Created

#### Events API (`/api/events`)
```
POST   /api/events                    - Create event
GET    /api/events                    - Get all events
GET    /api/events/:id                - Get event details
POST   /api/events/:id/register       - Register for event
DELETE /api/events/:id/register       - Cancel registration
GET    /api/events/user/registered    - Get user's events
```

#### Pets API (`/api/pets`)
```
POST   /api/pets                      - Add pet
GET    /api/pets/my-pets              - Get user's pets
GET    /api/pets/:id                  - Get pet details
PATCH  /api/pets/:id                  - Update pet
DELETE /api/pets/:id                  - Delete pet
```

## 🎯 Features to Implement in Frontend

### 1. Events Page (`frontend/src/routes/Events/Events.tsx`)

#### Features Needed:
- **Event List View**
  - Filter by type (Competition, Vaccination Drive, etc.)
  - Filter by date (Upcoming, Past)
  - Search by title/location
  - Sort by date, popularity

- **Event Card Display**
  - Event image
  - Title and type badge
  - Date, time, location
  - Registration status
  - Participants count
  - "Register" button

- **Create Event Form** (for organizers)
  - Title, description
  - Event type dropdown
  - Image upload (Cloudinary)
  - Location picker (map)
  - Date/time pickers
  - Registration deadline
  - Max participants
  - Registration fee
  - Requirements list
  - Prizes (for competitions)
  - Contact details

- **Event Detail Page**
  - Full event information
  - Image gallery
  - Map showing location
  - Registration form
  - Registered participants list
  - Share event button

- **Registration Form**
  - Select pet (if required)
  - Contact information
  - Payment (if fee required)
  - Confirmation

### 2. Enhanced Profile Page (`frontend/src/routes/Profile/Profile.tsx`)

#### Sections to Add:

**A. User Information**
- Profile photo
- Name, email, phone
- Bio/description
- Edit profile button

**B. My Pets Section**
- Grid of pet cards
- Each card shows:
  - Pet photo
  - Name, species, breed
  - Age
  - "View Details" button
- "Add New Pet" button

**C. Add/Edit Pet Modal**
- Pet name
- Species dropdown
- Breed input
- Age, gender, color, weight
- Photo upload (Cloudinary)
- Medical history
- Vaccination records
- Microchip ID
- Description

**D. Events Participated**
- List of registered events
- Tabs: Upcoming | Past | Cancelled
- Each event shows:
  - Event image
  - Title, date, location
  - Registration status
  - "View Details" button
  - "Cancel Registration" button (if upcoming)

**E. My Events (if organizer)**
- Events created by user
- Edit/Delete options
- View registrations
- Manage participants

## 📱 UI Components Needed

### Event Card Component
```tsx
<EventCard>
  <EventImage />
  <EventBadge type="COMPETITION" />
  <EventTitle />
  <EventDate />
  <EventLocation />
  <ParticipantsCount />
  <RegisterButton />
</EventCard>
```

### Pet Card Component
```tsx
<PetCard>
  <PetPhoto />
  <PetName />
  <PetSpecies />
  <PetAge />
  <ViewDetailsButton />
  <EditButton />
</PetCard>
```

### Event Form Component
```tsx
<EventForm>
  <BasicInfo />
  <ImageUpload />
  <LocationPicker />
  <DateTimePickers />
  <RegistrationSettings />
  <ContactInfo />
  <SubmitButton />
</EventForm>
```

## 🎨 Design Specifications

### Event Types & Colors
```
COMPETITION       → 🏆 Gold (#F59E0B)
VACCINATION_DRIVE → 💉 Blue (#3B82F6)
ADOPTION_CAMP     → 🏠 Green (#10B981)
WORKSHOP          → 📚 Purple (#8B5CF6)
MEETUP            → 👥 Pink (#EC4899)
OTHER             → 📅 Gray (#6B7280)
```

### Event Card Layout
```
┌─────────────────────────────┐
│ [Event Image]               │
│ 🏆 COMPETITION              │
├─────────────────────────────┤
│ Pet Show 2025               │
│ 📅 Jan 15, 2025             │
│ ⏰ 10:00 AM - 4:00 PM       │
│ 📍 Central Park             │
│ 👥 45/100 registered        │
│                             │
│ [Register Now]              │
└─────────────────────────────┘
```

### Profile Layout
```
┌─────────────────────────────────────┐
│ Profile Header                       │
│ [Photo] Name                         │
│ Email | Phone                        │
│ [Edit Profile]                       │
├─────────────────────────────────────┤
│ My Pets                              │
│ ┌────┐ ┌────┐ ┌────┐ [+ Add Pet]   │
│ │🐕 │ │🐱 │ │🐦 │               │
│ └────┘ └────┘ └────┘               │
├─────────────────────────────────────┤
│ Events Participated                  │
│ [Upcoming] [Past] [Cancelled]        │
│                                      │
│ ┌─────────────────────────────┐    │
│ │ Pet Show 2025               │    │
│ │ Jan 15 | Central Park       │    │
│ │ Status: Confirmed           │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## 🔧 Implementation Steps

### Phase 1: Events Page (Priority)
1. Create Events.tsx component
2. Implement event list view
3. Add filters and search
4. Create event card component
5. Implement event detail view
6. Add registration functionality

### Phase 2: Create Event Form
1. Build form component
2. Add image upload
3. Implement location picker
4. Add date/time pickers
5. Handle form submission

### Phase 3: Enhanced Profile
1. Update Profile.tsx
2. Add pets section
3. Create pet card component
4. Implement add/edit pet modal
5. Add events participated section

### Phase 4: Integration
1. Connect all components
2. Add navigation
3. Test all flows
4. Polish UI/UX

## 📊 Database Relationships

```
User
  ├─ owns → Pet[]
  ├─ organizes → Event[]
  └─ registers for → Event.registrations[]

Event
  ├─ organized by → User
  └─ registrations[] → User + Pet

Pet
  └─ owned by → User
```

## 🚀 Quick Start (For Developers)

### 1. Backend is Ready
```bash
cd backend
npm run dev
```

### 2. Create Frontend Components
```bash
cd frontend/src/routes/Events
# Create Events.tsx
# Create Events.css
# Create EventCard.tsx
# Create EventForm.tsx
```

### 3. Update Profile
```bash
cd frontend/src/routes/Profile
# Update Profile.tsx
# Add PetCard component
# Add EventsList component
```

### 4. Test API Endpoints
```bash
# Create event
POST http://localhost:5001/api/events

# Get events
GET http://localhost:5001/api/events

# Add pet
POST http://localhost:5001/api/pets

# Get my pets
GET http://localhost:5001/api/pets/my-pets
```

## 📝 Example Data

### Sample Event
```json
{
  "title": "Annual Pet Show 2025",
  "description": "Join us for the biggest pet show of the year!",
  "type": "COMPETITION",
  "images": ["https://res.cloudinary.com/..."],
  "location": {
    "coordinates": [77.2090, 28.6139]
  },
  "address": "Central Park, New Delhi",
  "venue": "Main Arena",
  "startDate": "2025-01-15",
  "endDate": "2025-01-15",
  "startTime": "10:00",
  "endTime": "16:00",
  "registrationDeadline": "2025-01-10",
  "maxParticipants": 100,
  "registrationFee": 500,
  "requirements": ["Pet vaccination certificate", "Owner ID proof"],
  "prizes": ["1st Prize: ₹10,000", "2nd Prize: ₹5,000", "3rd Prize: ₹2,000"],
  "contactEmail": "events@petconnect.com",
  "contactPhone": "9999999999"
}
```

### Sample Pet
```json
{
  "name": "Max",
  "species": "DOG",
  "breed": "Golden Retriever",
  "age": 3,
  "gender": "MALE",
  "color": "Golden",
  "weight": 30,
  "photos": ["https://res.cloudinary.com/..."],
  "vaccinations": [
    {
      "name": "Rabies",
      "date": "2024-01-15",
      "nextDue": "2025-01-15"
    }
  ],
  "microchipId": "123456789",
  "description": "Friendly and playful golden retriever"
}
```

## ✅ Success Criteria

- [ ] Users can create events
- [ ] Users can browse and filter events
- [ ] Users can register for events
- [ ] Users can add their pets
- [ ] Profile shows all pets with photos
- [ ] Profile shows events participated
- [ ] Images upload to Cloudinary
- [ ] Location picker works
- [ ] Registration system works
- [ ] Email notifications (future)

## 🎉 Benefits

### For Users
- Discover pet events nearby
- Register for competitions
- Track vaccination drives
- Manage pet profiles
- View event history

### For Organizers
- Create and manage events
- Track registrations
- Communicate with participants
- Manage capacity

### For Community
- Centralized event platform
- Increased participation
- Better organization
- Community building

---

**Status:** Backend Complete ✅ | Frontend Pending 🔄

**Next Steps:** Implement frontend components for Events and Profile pages.
