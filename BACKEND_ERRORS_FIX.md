# 🔧 Backend Errors - Troubleshooting Guide

## ❌ Current Errors

```
Failed to load resource: 500 (Internal Server Error)
- /api/products
- /api/users/me
- /api/pets/my-pets
- /api/events/user/registered
- /api/feedback
```

## 🔍 Root Cause

**500 Internal Server Error** typically means:
1. Backend server is not running
2. Database connection failed
3. Missing environment variables
4. Code error in backend routes

---

## ✅ Solution Steps

### Step 1: Check if Backend is Running

```bash
# Check if process is running on port 5001
lsof -i :5001

# If nothing shows, backend is not running
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 5001
MongoDB connected successfully
```

### Step 3: Check MongoDB Connection

**In `backend/.env`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/petconnect?retryWrites=true&w=majority
```

**Test Connection:**
```bash
# In backend directory
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'your-uri').then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err))"
```

### Step 4: Check Environment Variables

**Required in `backend/.env`:**
```env
# Database
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5001
```

### Step 5: Check Backend Logs

When you start the backend, look for errors:

```bash
cd backend
npm run dev

# Look for:
# ✅ "Server running on port 5001"
# ✅ "MongoDB connected"
# ❌ Any error messages
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module"
```bash
cd backend
npm install
```

### Issue 2: "MongoDB connection failed"
- Check MONGODB_URI in .env
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Check database user permissions

### Issue 3: "Port 5001 already in use"
```bash
# Kill process on port 5001
lsof -i :5001
kill -9 <PID>

# Or use different port
# In backend/.env: PORT=5002
# In frontend/src/services/api.ts: baseURL: 'http://localhost:5002/api'
```

### Issue 4: "JWT must be provided"
- Check if JWT_SECRET is set in .env
- Clear browser localStorage and login again

---

## 🔄 Quick Fix Commands

```bash
# 1. Stop any running backend
pkill -f "node.*backend"

# 2. Navigate to backend
cd backend

# 3. Install dependencies
npm install

# 4. Start server
npm run dev

# 5. In another terminal, check if it's running
curl http://localhost:5001/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Server is running"}
```

---

## 📝 Verify Each Endpoint

Once backend is running, test each endpoint:

```bash
# Health check
curl http://localhost:5001/api/health

# Products (should return array)
curl http://localhost:5001/api/store/products

# If you get HTML instead of JSON, wrong port or server not running
```

---

## 🎯 Frontend Configuration

**Check `frontend/src/services/api.ts`:**
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5001/api',  // Must match backend port
  headers: {
    'Content-Type': 'application/json'
  }
})
```

---

## ✅ Success Checklist

- [ ] Backend server running on port 5001
- [ ] MongoDB connected successfully
- [ ] All environment variables set
- [ ] Health endpoint returns 200
- [ ] Products endpoint returns data
- [ ] No errors in backend console
- [ ] Frontend can fetch data

---

## 🚀 After Fixing

Once backend is running:
1. Refresh frontend (Ctrl+R or Cmd+R)
2. Clear browser cache if needed
3. Check browser console - errors should be gone
4. Test each feature

---

## 📞 Still Having Issues?

Check backend console for specific error messages:
- Database connection errors
- Missing model errors
- Route not found errors
- Authentication errors

The error message will tell you exactly what's wrong!
