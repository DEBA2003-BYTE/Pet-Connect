# How to Start PetConnect Servers

## Prerequisites

1. **MongoDB** must be running
2. **Bun** must be installed
3. **Dependencies** must be installed

## Step-by-Step Startup

### 1. Start MongoDB

Open a terminal and run:
```bash
mongod
```

Or if using MongoDB as a service:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Verify MongoDB is running:
```bash
mongosh
# Should connect successfully
```

### 2. Start Backend Server

Open a new terminal:
```bash
cd backend
bun run dev
```

You should see:
```
🚀 Server running on port 5000
MongoDB connected successfully
```

If you see errors:
- Check MongoDB is running
- Check `.env` file has correct `MONGODB_URI`
- Check port 5000 is not in use

### 3. Start Frontend Server

Open another terminal:
```bash
cd frontend
bun run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Solution: Start MongoDB with `mongod` command
- Check MongoDB is running on port 27017

**Error: "Port 5000 already in use"**
- Solution: Kill the process using port 5000
  ```bash
  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  ```

**Error: "Module not found"**
- Solution: Install dependencies
  ```bash
  cd backend
  bun install
  ```

### Frontend Issues

**Error: "Failed to load module"**
- Solution: Install dependencies
  ```bash
  cd frontend
  bun install
  ```

**Error: "Cannot connect to API"**
- Solution: Make sure backend is running on port 5000
- Check `frontend/src/services/api.ts` has correct baseURL

**403 Error on Signup**
- Solution: Backend server is not running or MongoDB is not connected
- Check backend terminal for errors

### Leaflet Map Issues

**Map not displaying**
- Solution: Clear browser cache and reload
- Check browser console for errors
- Leaflet CSS should be imported

**Markers not showing**
- Solution: The Leaflet icon fix in the code should handle this
- If still not working, check browser console

## Quick Start Script

Create a file `start.sh`:
```bash
#!/bin/bash

# Start MongoDB (if not running as service)
# mongod &

# Start Backend
cd backend
bun run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
cd ../frontend
bun run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Servers started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

Make it executable:
```bash
chmod +x start.sh
./start.sh
```

## Verify Everything is Working

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"ok","message":"PetConnect API is running"}
```

### 2. Check Frontend
Open browser to `http://localhost:5173`
- Should see landing page
- Click "Sign Up" - should open signup form
- No console errors

### 3. Test Database Connection
```bash
mongosh
use petconnect
db.users.find()
```

Should connect without errors (collection may be empty initially)

## Environment Variables

Make sure `backend/.env` has:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/petconnect
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Common Workflow

1. Start MongoDB (once)
2. Start Backend (terminal 1)
3. Start Frontend (terminal 2)
4. Develop and test
5. Stop servers with Ctrl+C

## Production Deployment

For production, you'll need to:
1. Use MongoDB Atlas (cloud database)
2. Deploy backend to Render/Railway/Fly.io
3. Deploy frontend to Vercel/Netlify
4. Update environment variables
5. Update API baseURL in frontend

## Need Help?

Check the logs:
- Backend: Terminal where `bun run dev` is running
- Frontend: Browser console (F12)
- MongoDB: `mongod` terminal output

Common log messages:
- ✅ "Server running on port 5000" - Backend OK
- ✅ "MongoDB connected successfully" - Database OK
- ✅ "VITE ready" - Frontend OK
- ❌ "ECONNREFUSED" - Service not running
- ❌ "MongoServerError" - Database issue
