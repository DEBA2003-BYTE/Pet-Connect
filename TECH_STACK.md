# 🛠️ PetConnect Tech Stack

## Overview
PetConnect is a full-stack web application built with modern technologies, focusing on performance, type safety, and developer experience.

---

## Frontend Stack

### Core Framework
- **React 19.2.1** - Latest React with concurrent features
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite 7.2.6** - Lightning-fast build tool and dev server

### Routing & State Management
- **React Router DOM 7.10.1** - Client-side routing
- **TanStack React Query 5.90.12** - Server state management, caching, and data fetching

### UI & Styling
- **CSS3** - Custom styling with modern CSS features
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout systems

### Maps & Location
- **Leaflet 1.9.4** - Interactive maps library
- **React Leaflet 5.0.0** - React components for Leaflet
- **Geolocation API** - Browser GPS location access
- **Haversine Formula** - Distance calculations

### Forms & Validation
- **React Hook Form 7.68.0** - Performant form handling
- **Zod 4.1.13** - TypeScript-first schema validation

### HTTP Client
- **Axios 1.13.2** - Promise-based HTTP client

### Build Tools
- **Vite Plugin React 5.1.1** - Fast refresh and JSX transform
- **Bun** - Fast JavaScript runtime and package manager

---

## Backend Stack

### Runtime & Framework
- **Bun** - Fast all-in-one JavaScript runtime
- **Node.js Compatible** - Can run on Node.js as well
- **Express 5.2.1** - Web application framework
- **TypeScript 5.x** - Type-safe backend code

### Database
- **MongoDB** - NoSQL document database
- **Mongoose 9.0.1** - MongoDB object modeling
- **MongoDB Atlas** - Cloud-hosted database

### Authentication & Security
- **JWT (jsonwebtoken 9.0.3)** - Token-based authentication
- **bcryptjs 3.0.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

### File Storage
- **Cloudinary 2.8.0** - Cloud-based image and video management
- **Image Upload** - Direct client-side uploads with signed URLs

### Environment Management
- **dotenv 17.2.3** - Environment variable management

---

## External APIs & Services

### Maps & Location
- **OpenStreetMap** - Free map data
- **Overpass API** - Query OpenStreetMap data
- **Leaflet Tiles** - Map rendering

### Cloud Services
- **Cloudinary** - Image hosting and transformation
- **MongoDB Atlas** - Database hosting

---

## Development Tools

### Package Management
- **Bun** - Fast package manager (primary)
- **npm** - Node package manager (fallback)

### Code Quality
- **TypeScript Strict Mode** - Enhanced type checking
- **ESNext** - Latest JavaScript features
- **Module Preservation** - Modern module system

### Development Experience
- **Hot Module Replacement (HMR)** - Instant updates during development
- **Fast Refresh** - Preserve component state during edits
- **Watch Mode** - Auto-restart on file changes

---

## Architecture

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── routes/           # Page components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   └── App.tsx           # Root component
```

### Backend Architecture
```
backend/
├── src/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express route handlers
│   ├── middlewares/      # Custom middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── server.ts         # Express app setup
```

### Design Patterns
- **MVC Pattern** - Model-View-Controller separation
- **RESTful API** - Standard HTTP methods and endpoints
- **Context API** - Global state management
- **Custom Hooks** - Reusable logic extraction
- **Middleware Pattern** - Request/response processing

---

## Key Features Implementation

### Real-time Location Features
- **GPS Tracking** - Browser Geolocation API
- **Distance Calculation** - Haversine formula
- **60km Radius Filter** - Location-based filtering
- **Sorting by Distance** - Nearest-first ordering

### Authentication System
- **JWT Tokens** - Stateless authentication
- **Refresh Tokens** - Extended sessions
- **Role-Based Access** - User, Volunteer, NGO, Seller, Admin
- **Password Hashing** - bcrypt with salt rounds

### Image Management
- **Client-side Upload** - Direct to Cloudinary
- **Signed URLs** - Secure upload authentication
- **Image Transformation** - On-the-fly resizing
- **Multiple Images** - Support for galleries

### Map Integration
- **Interactive Maps** - Click, drag, zoom
- **Custom Markers** - Location pins
- **Popups** - Information display
- **Geolocation** - Auto-center on user

---

## Performance Optimizations

### Frontend
- **Code Splitting** - Lazy loading routes
- **React Query Caching** - Reduce API calls
- **Memoization** - Prevent unnecessary re-renders
- **Vite Build** - Optimized production bundles

### Backend
- **MongoDB Indexing** - Fast queries
- **Geospatial Queries** - Efficient location searches
- **Connection Pooling** - Database optimization
- **Bun Runtime** - Fast JavaScript execution

---

## Security Features

### Authentication
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Refresh token rotation
- ✅ Role-based access control

### Data Protection
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ Input validation with Zod
- ✅ MongoDB injection prevention

### API Security
- ✅ Authentication middleware
- ✅ Request validation
- ✅ Error handling
- ✅ Rate limiting ready

---

## Database Schema

### Collections
- **Users** - User accounts and profiles
- **RescueReports** - Animal rescue cases
- **ServiceLocations** - Pet services (vets, clinics)
- **LostFound** - Lost and found pets
- **AdoptionListings** - Pets for adoption
- **Events** - Pet-related events
- **Products** - Pet store items
- **Orders** - E-commerce orders
- **Community** - Social posts
- **Feedback** - User feedback

### Geospatial Indexing
- 2dsphere indexes for location-based queries
- Efficient radius searches
- Distance calculations

---

## Deployment Ready

### Frontend
- ✅ Production build with Vite
- ✅ Environment-based configuration
- ✅ Static asset optimization
- ✅ Ready for Vercel, Netlify, or any static host

### Backend
- ✅ Bun production mode
- ✅ Environment variables
- ✅ MongoDB Atlas connection
- ✅ Ready for Railway, Render, or any Node.js host

---

## Browser Support

### Modern Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features
- ES2020+ JavaScript
- Geolocation API
- Fetch API
- LocalStorage
- CSS Grid & Flexbox

---

## Development Requirements

### Minimum Requirements
- **Bun** 1.0+ (or Node.js 18+)
- **MongoDB** 6.0+
- **Modern Browser** with dev tools
- **Git** for version control

### Recommended
- **VS Code** with TypeScript extension
- **MongoDB Compass** for database management
- **Postman** for API testing
- **React DevTools** browser extension

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Scripts

### Frontend
```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
```

### Backend
```bash
bun run dev              # Start with hot reload
bun run start            # Start production server
bun run seed             # Seed database with products
bun run update-images    # Update product images
```

---

## Future Tech Considerations

### Potential Additions
- [ ] **Socket.io** - Real-time notifications
- [ ] **Redis** - Caching layer
- [ ] **GraphQL** - Alternative to REST
- [ ] **Docker** - Containerization
- [ ] **CI/CD** - Automated deployment
- [ ] **Testing** - Jest, React Testing Library
- [ ] **PWA** - Progressive Web App features
- [ ] **Push Notifications** - Web push API

---

## License & Credits

### Open Source Libraries
All dependencies are open source and properly licensed.

### External Services
- OpenStreetMap - ODbL License
- Cloudinary - Commercial service
- MongoDB Atlas - Commercial service

---

**Built with ❤️ using modern web technologies**
