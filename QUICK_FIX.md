# Quick Fix for Registration Issue

## Problem
The frontend can't connect to the backend because:
1. Port 5000 is used by macOS AirPlay
2. Backend needs to run on port 5001 instead

## Solution

### Step 1: Start Backend on Port 5001

Open a new terminal and run:
```bash
cd backend
bun run dev
```

You should see:
```
🚀 Server running on port 5001
✅ MongoDB Connected: localhost
```

**Important:** Keep this terminal open!

### Step 2: Frontend is Already Running

Your frontend is already running on http://localhost:3000
Keep that terminal open too.

### Step 3: Test Registration

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Pet Owner
4. Click "Sign Up"

It should work now!

## If Backend Shows Wrong Port

If the backend terminal shows "port 5000" instead of "5001", the .env file wasn't reloaded.

**Fix:**
1. Stop the backend (Ctrl+C)
2. Check `backend/.env` has `PORT=5001`
3. Start backend again: `bun run dev`

## Verify Everything is Working

### Check Backend:
```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{"status":"ok","message":"PetConnect API is running"}
```

### Check Frontend:
Open browser to http://localhost:3000 - should see the landing page

## Common Issues

**"Port already in use"**
- Kill the process: `lsof -ti:5001 | xargs kill -9`
- Then start backend again

**"MongoDB connection error"**
- Start MongoDB: `mongod` in another terminal
- Or if using brew: `brew services start mongodb-community`

**"Cannot connect to server"**
- Make sure backend terminal is running
- Check it says "port 5001" not "port 5000"

## Current Setup

- **Frontend:** http://localhost:3000 (already running ✅)
- **Backend:** http://localhost:5001 (needs to be started)
- **MongoDB:** mongodb://localhost:27017 (needs to be running)

## Next Steps After Registration Works

1. Try logging in with your new account
2. Explore the dashboard
3. Test the Rescue Map
4. Try reporting a lost pet
5. Browse adoption listings
