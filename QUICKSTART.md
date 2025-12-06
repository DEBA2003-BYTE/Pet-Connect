# PetConnect - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Bun** (latest version) - [Install Bun](https://bun.sh)
- **MongoDB** - Running locally or MongoDB Atlas account
- **Cloudinary** account (for image uploads) - [Sign up](https://cloudinary.com)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Dependencies are already installed
# If needed, run: bun install

# Configure environment variables
# Edit the .env file with your credentials:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (change to a secure random string)
# - JWT_REFRESH_SECRET (change to a secure random string)
# - CLOUDINARY_CLOUD_NAME (from your Cloudinary dashboard)
# - CLOUDINARY_API_KEY (from your Cloudinary dashboard)
# - CLOUDINARY_API_SECRET (from your Cloudinary dashboard)

# Start the development server
bun dev
```

The backend will start on **http://localhost:5000**

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Dependencies are already installed
# If needed, run: bun install

# Start the development server
bun dev
```

The frontend will start on **http://localhost:3000**

## Testing the Application

1. Open your browser and navigate to **http://localhost:3000**
2. You'll see the PetConnect landing page
3. Click "Join as Volunteer" or "Sign up" to create an account
4. After signing up, you'll be redirected to the dashboard
5. Explore the features:
   - **Rescue Map** - View and report injured animals
   - **Services** - Find nearby vets and pet services
   - **Lost & Found** - Report or search for lost pets
   - **Adoptions** - Browse pets available for adoption
   - **Community** - Engage with other pet lovers
   - **Events** - Join pet-related events

## Default User Roles

When signing up, you can choose from:
- **Pet Owner** - Manage pets and health records
- **Volunteer** - Accept rescue missions and earn credits
- **NGO/Rescue** - Manage rescues and post adoptions
- **Veterinarian** - Provide services
- **Service Provider** - List your services

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check that port 5000 is not in use
- Verify your `.env` file has correct values

### Frontend won't start
- Ensure port 3000 is not in use
- Check that all dependencies are installed: `bun install`

### TypeScript errors
- Run `bun install` in both frontend and backend directories
- Restart your IDE/editor

### API requests failing
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify the proxy configuration in `frontend/vite.config.ts`

## Next Steps

- Add sample data to test features
- Configure Cloudinary for image uploads
- Customize the styling in `frontend/src/styles/index.css`
- Add more features as per the documentation in `docs/`

## Production Deployment

### Backend
- Set secure JWT secrets
- Use MongoDB Atlas for production database
- Deploy to Render, Fly.io, or Railway
- Set environment variables in your hosting platform

### Frontend
- Build: `bun run build`
- Deploy to Vercel, Netlify, or similar
- Update API proxy to point to production backend URL

## Support

For issues or questions, refer to:
- `README.md` - Project overview
- `docs/Frontend.md` - Frontend architecture
- `docs/Backend.md` - Backend API documentation
- `docs/Plan.md` - Complete project plan

Happy coding! 🐾
