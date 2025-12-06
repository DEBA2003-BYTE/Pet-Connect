# 🔧 Community Feature - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to create post" Error

**Symptoms:**
- Error message when clicking "Post" button
- Console shows connection refused or 404 errors

**Solutions:**

#### ✅ Solution 1: Start the Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5001
Connected to MongoDB
```

#### ✅ Solution 2: Check MongoDB Connection
1. Open `backend/.env`
2. Verify `MONGODB_URI` is correct
3. Check MongoDB Atlas:
   - Cluster is running
   - IP address is whitelisted
   - Username/password are correct

#### ✅ Solution 3: Check Cloudinary Configuration
1. Open `backend/.env`
2. Verify these variables exist:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Get credentials from: https://cloudinary.com/console

---

### Issue 2: Images Not Uploading

**Symptoms:**
- Image upload button doesn't work
- Images don't appear after selection
- 404 errors for image URLs

**Solutions:**

#### ✅ Solution 1: Verify Cloudinary Setup
```bash
# Check if Cloudinary credentials are set
cd backend
cat .env | grep CLOUDINARY
```

Should show:
```
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

#### ✅ Solution 2: Test Image Upload Endpoint
```bash
# Test the media upload endpoint
curl -X POST http://localhost:5001/api/media/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

#### ✅ Solution 3: Check File Size
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- If file is too large, compress it first

#### ✅ Solution 4: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - `Failed to upload image`
   - `Cloudinary error`
   - `Network error`

---

### Issue 3: Share Button Not Working

**Symptoms:**
- Clicking share doesn't do anything
- Share count doesn't increase
- No success message

**Solutions:**

#### ✅ Solution 1: Check Backend Route
```bash
# Test share endpoint
curl -X POST http://localhost:5001/api/community/posts/POST_ID/share \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### ✅ Solution 2: Verify User is Logged In
- Check if token exists in localStorage
- Try logging out and logging back in
- Check browser console for auth errors

#### ✅ Solution 3: Check Post ID
- Make sure the post exists
- Verify the post ID is correct
- Try refreshing the page

---

### Issue 4: Comments Not Showing

**Symptoms:**
- Comments don't appear after posting
- Comment input doesn't clear
- No error message

**Solutions:**

#### ✅ Solution 1: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Post a comment
4. Look for `/api/community/posts/:id/comment` request
5. Check response status (should be 200)

#### ✅ Solution 2: Verify MongoDB Connection
```bash
# Check if MongoDB is connected
# Look for this in backend logs:
Connected to MongoDB
```

#### ✅ Solution 3: Clear Cache and Refresh
```bash
# Clear browser cache
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)

# Or hard refresh
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)
```

---

### Issue 5: Feed Not Loading

**Symptoms:**
- "Loading feed..." message stays forever
- No posts appear
- Empty feed

**Solutions:**

#### ✅ Solution 1: Check Backend Logs
```bash
cd backend
npm run dev

# Look for errors like:
# - MongoDB connection error
# - Route not found
# - Authentication error
```

#### ✅ Solution 2: Create Test Post
1. Make sure you're logged in
2. Create a simple post: "Test post"
3. Don't add images first
4. Click "Post"
5. Check if it appears

#### ✅ Solution 3: Check Browser Console
```javascript
// Open console and run:
fetch('http://localhost:5001/api/community/feed', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('Feed data:', data))
```

---

### Issue 6: "Cannot follow yourself" Error

**Symptoms:**
- Error when trying to follow someone
- Follow button doesn't work

**Solution:**
- This is expected behavior
- You cannot follow your own account
- Try following a different user

---

### Issue 7: Suggestions Not Showing

**Symptoms:**
- Right sidebar is empty
- "No suggestions available" message
- No users to follow

**Solutions:**

#### ✅ Solution 1: Create More Users
1. Logout
2. Create 2-3 new accounts
3. Login with original account
4. Check suggestions again

#### ✅ Solution 2: Unfollow Some Users
- If you're following everyone, no suggestions will show
- Unfollow a user to see them in suggestions again

---

## 🔍 Debugging Steps

### Step 1: Check Backend Status
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Should see:
# 🚀 Server running on port 5001
# Connected to MongoDB
```

### Step 2: Check Frontend Status
```bash
# Terminal 2: Start frontend
cd frontend
npm run dev

# Should see:
# VITE ready in XXXms
# ➜ Local: http://localhost:3000/
```

### Step 3: Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Should return:
# {"status":"ok","message":"PetConnect API is running"}
```

### Step 4: Check Browser Console
1. Open http://localhost:3000/community
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for errors (red text)
5. Look for successful logs (green ✅)

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try creating a post
4. Look for these requests:
   - `POST /api/community/posts` (should be 201)
   - `POST /api/media/upload` (should be 200)
   - `GET /api/community/feed` (should be 200)

---

## 📊 Expected Behavior

### Creating a Post
```
1. User clicks "What's on your mind?"
   ✅ Text area expands
   
2. User types content
   ✅ Post button becomes enabled
   
3. User uploads image (optional)
   ✅ Image appears in preview
   ✅ Console shows: "Image uploaded: https://..."
   
4. User clicks "Post"
   ✅ Button shows "⏳ Posting..."
   ✅ Console shows: "Creating post with: {...}"
   ✅ Console shows: "Post created successfully: {...}"
   ✅ Alert shows: "✅ Post created successfully!"
   ✅ Post appears at top of feed
   ✅ Form clears and closes
```

### Liking a Post
```
1. User clicks "🤍 Like"
   ✅ Button changes to "❤️ Like" (red)
   ✅ Like count increases by 1
   ✅ No page reload
   
2. User clicks "❤️ Like" again
   ✅ Button changes back to "🤍 Like"
   ✅ Like count decreases by 1
```

### Commenting
```
1. User types in comment box
   ✅ Text appears in input
   
2. User presses Enter or clicks ➤
   ✅ Comment appears immediately
   ✅ Input clears
   ✅ Comment shows user avatar and name
   ✅ Timestamp shows "Just now"
```

### Sharing
```
1. User clicks "🔄 Share"
   ✅ Alert shows: "✅ Post shared successfully! Total shares: X"
   ✅ Share count increases
   ✅ Post appears in followers' feeds
```

---

## 🚨 Error Messages Explained

### "Failed to create post"
**Cause:** Backend not running or MongoDB not connected
**Fix:** Start backend server and check MongoDB connection

### "Failed to upload image"
**Cause:** Cloudinary credentials missing or invalid
**Fix:** Add Cloudinary credentials to `backend/.env`

### "Cannot follow yourself"
**Cause:** Trying to follow your own account
**Fix:** This is expected - follow a different user

### "Already following this user"
**Cause:** You're already following this user
**Fix:** This is expected - unfollow first if needed

### "Post not found"
**Cause:** Post was deleted or ID is invalid
**Fix:** Refresh the page to update the feed

### "Not authorized"
**Cause:** Token expired or invalid
**Fix:** Logout and login again

---

## 🔧 Quick Fixes

### Reset Everything
```bash
# Stop all servers
Ctrl+C in both terminals

# Clear browser data
1. Open DevTools (F12)
2. Application tab
3. Clear storage
4. Reload page

# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev

# Login again
Go to http://localhost:3000/login
```

### Test with cURL
```bash
# Get your token
TOKEN=$(curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  | jq -r '.token')

# Create a test post
curl -X POST http://localhost:5001/api/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post from cURL","images":[]}'

# Get feed
curl http://localhost:5001/api/community/feed \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📞 Still Having Issues?

### Check These Files:
1. `backend/.env` - Environment variables
2. `backend/src/server.ts` - Server configuration
3. `backend/src/routes/community.routes.ts` - API routes
4. `frontend/src/routes/Community/Community.tsx` - Frontend component

### Verify These Services:
- ✅ MongoDB Atlas cluster is running
- ✅ Cloudinary account is active
- ✅ Backend server on port 5001
- ✅ Frontend server on port 3000
- ✅ User is logged in with valid token

### Common Port Conflicts:
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 PID

# Check if port 3000 is in use
lsof -i :3000
```

---

## ✅ Success Checklist

Before reporting an issue, verify:
- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] MongoDB is connected
- [ ] Cloudinary credentials are set
- [ ] User is logged in
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests
- [ ] Tried hard refresh (Ctrl+F5)
- [ ] Tried different browser
- [ ] Checked all environment variables

---

**If all else fails, restart everything and try again!** 🔄
