# frontend.md

## 1. Overview

The **PetConnect Frontend** is a responsive, mobile-first web application that enables Indian users to:

- Report injured street animals on a **real-time rescue map**.
- Discover **nearby pet services** (vets, groomers, parks, clinics).
- Manage **lost & found pets**, **adoptions**, **pet health records**, and **community interactions**.

It is built with **React + Vite** (or similar SPA stack) and uses **Bun** as the package manager and dev runtime. All map features use **Leaflet with OpenStreetMap tiles**, explicitly **not using OpenStreet API keys**. Images are stored in **Cloudinary**, with uploads initiated from the frontend and securely signed by the backend.

---

## 2. Tech Stack (Frontend)

- **Framework**: React (SPA)
- **Bundler/Dev Tooling**: Vite (run with Bun – `bun install`, `bun dev`)
- **Routing**: React Router
- **State Management**: React Query (for server state) + Context/Redux (for global UI/auth state)
- **UI Library**: Custom components + a lightweight UI framework (e.g., Material UI or Chakra UI) – optional
- **Maps**: Leaflet + `react-leaflet` with OpenStreetMap tiles
- **HTTP Client**: Fetch or Axios
- **Forms & Validation**: React Hook Form + Zod/Yup
- **Media Hosting**: Cloudinary (unsigned or signed uploads via backend)
- **Auth**: JWT-based (access token in memory/HTTP-only cookie, refresh token via secure cookie) – handled via backend APIs

---

## 3. High-Level Frontend Architecture

```plaintext
src/
  main.tsx / main.jsx       # App entry
  App.tsx                   # Route configuration, layout shell
  routes/
    Landing/
    Auth/
    Dashboard/
    RescueMap/
    NearbyServices/
    LostFound/
    Adoption/
    Community/
    Events/
    Profile/
    Admin/
  components/
    layout/
    map/
    forms/
    cards/
    common/
  hooks/
  context/
  services/
  utils/
  styles/
4. Routes & Pages
4.1 Public Routes
/ – Landing Page
Hero section: problem summary (stray animals, lack of unified platform).
CTA buttons: “Report Animal in Need”, “Find Nearby Vet”, “Join as Volunteer”.
Brief explanation of PetConnect features.
/auth/login & /auth/signup
Email/password login & registration.
Role selection at signup: Pet Owner, NGO/Rescue, Veterinarian, Volunteer, Service Provider.
Forgot password flow trigger.
/lost-found (Public view)
Grid/list of lost and found pets with filters:
Location, pet type, status (Lost/Found/Recovered).
Clicking a pet card opens details and contact/“notify NGO” button.
/adoptions (Public view)
Public listing of adoptable pets from verified NGOs.
Filtering by city, species, age, vaccination status.
4.2 Authenticated Routes
/dashboard
Role-aware dashboard:
Pet Owner: quick access to My Pets, Lost & Found, Nearby Services.
NGO/Rescue: Pending rescue reports, adoption requests.
Vet: upcoming consultations, requests for help.
Volunteer: recent rescue alerts, gamified stats (points, badges).
/rescue-map
Leaflet Map View using OpenStreetMap tiles, e.g.:
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png (or another OSM-compatible provider).
Features:
Current location marker for the user.
Clustered markers for:
Rescue reports (injured animals).
Service providers (hospitals, clinics, etc.).
Sidebar with:
“Report an Injured Animal” form.
Filter toggles (only rescues, only vets, only NGOs, etc.).
Marker popups show:
Title, status (open/in progress/resolved), time, reporter.
“Accept Rescue” button for volunteers/NGOs.
“Navigate” link to open directions (Google Maps URL / device maps).
/nearby-services
Search form:
Location: “Use current location” or manual city/area input.
Filters: vets, 24/7 clinics, parks, groomers, trainers, pet-friendly cafés.
Results shown as:
List + optional embedded Leaflet map with markers.
Each service card: name, distance, rating, verified badge, call/contact buttons.
/lost-found/manage
For logged-in users to create and manage lost/found reports.
Form fields:
Pet details (type, breed, color, age, distinctive marks).
Last seen location (map click or address search).
Date/time.
Photos (Cloudinary upload).
For Lost cases: “Mark as recovered” action.
/adoptions/manage
For NGOs to:
Create adoption listings with pet details and photos.
Mark pets as adopted.
See adoption application requests.
/community
Forum-like layout:
Categories: “Health & Care”, “Training”, “Adoption Stories”, “Rescue Alerts”, “General”.
Features:
Post creation with text + optional images.
Comment threads.
Upvote/like and report options.
Simple moderation tools visible to admin/NGO roles.
/events
Calendar/list view of:
Pet meetups, vaccination drives, adoption camps, awareness drives.
For qualified roles (NGO, admin) – event creation form.
/profile
Tabs:
My Pets & Health Records:
Pet profile: name, species, breed, age, weight.
Digital health records: vaccination schedule, deworming, prescriptions, notes.
Volunteer Stats:
Credits earned, badges, rescue history, leaderboard rank.
Account Settings:
Edit profile, change password, notification preferences.
/admin
For admins:
User management (view users, roles, verification state for NGOs/vets).
Content moderation dashboard for reports and posts.
Control flags (e.g., feature toggles, global announcements).
5. Core Components
5.1 Map Components
MapContainer (wraps Leaflet map with base OSM tiles).
RescueMarker, ServiceMarker, LostPetMarker.
LocationFilterControls.
MapLegend (icons for rescues, vets, NGOs, etc.).
5.2 Form Components
Generic FormInput, FormSelect, FormTextArea.
ImageUpload (Cloudinary widget / custom uploader).
LocationPicker (map click to choose coordinates, reverse-geocode via backend if required).
5.3 UI & Data Components
Navbar, Sidebar, MobileBottomNav.
CardRescue, CardService, CardPet, CardEvent.
UserAvatar, BadgeVolunteer.
NotificationDropdown (rescue alerts, adoption requests, etc.).
6. State Management & Data Flow
Auth state stored in:
React context + optional localStorage (for basic info, NOT for sensitive tokens).
Access token handled via HttpOnly cookies or in-memory (frontend only sees “authorized” flag).
API calls via a central apiClient abstraction.
React Query handles:
Rescue reports (useRescueReports).
Nearby services (useNearbyServices).
Lost & found listings (useLostFound).
Adoptions (useAdoptions).
User profile & health records.
Optional: WebSocket or SSE client for real-time rescue alerts (subscribe after login).
7. Cloudinary Integration (Frontend)
On forms requiring images:
Use a custom file input that:
Sends selected files to /api/media/signature (backend) to get Cloudinary upload signature (if using signed uploads).
Uses Cloudinary upload endpoint directly from browser.
Store only secure URLs returned by Cloudinary in the backend.
8. Styling & UX
Clean, accessible design with:
Clear role-based navigation.
Dark/light mode (optional).
Strong emphasis on map views and cards.
UX patterns:
Loading skeletons (for maps/lists).
Toast notifications for actions (report submitted, rescue accepted, etc.).
Mobile-first layout, especially for rescue reporting on the go.
