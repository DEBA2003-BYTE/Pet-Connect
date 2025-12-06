# PetConnect Deployment Guide

## 🎯 Overview

This guide covers deploying PetConnect to production with:
- **Frontend:** Vercel/Netlify
- **Backend:** Render/Railway/Fly.io
- **Database:** MongoDB Atlas (Cloud)
- **Media:** Cloudinary

---

## ✅ Prerequisites Completed

- [x] MongoDB Atlas setup
- [x] Cloudinary account configured
- [x] Environment variables ready

---

## 📦 Part 1: MongoDB Atlas (Already Done!)

Your MongoDB is already configured with Atlas:
```
mongodb+srv://Deba:Deba9007@cluster0.ly05itn.mongodb.net/
```

### Additional Atlas Configuration:

1. **Add Database Name:**
   Update your connection string to include the database name:
   ```
   mongodb+srv://Deba:Deba9007@cluster0.ly05itn.mongodb.net/petconnect?retryWrites=true&w=majority
   ```

2. **Network Access:**
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access"
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - This allows your deployed backend to connect

3. **Database User:**
   - Ensure user `Deba` has read/write permissions
   - Password: `Deba9007`

---

## 🚀 Part 2: Deploy Backend

### Option A: Render (Recommended - Free Tier)

1. **Create Account:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` folder as root directory

3. **Configure Service:**
   ```
   Name: petconnect-backend
   Environment: Node
   Build Command: bun install
   Start Command: bun run start
   ```

4. **Add Environment Variables:**
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://Deba:Deba9007@cluster0.ly05itn.mongodb.net/petconnect?retryWrites=true&w=majority
   JWT_SECRET=f9a8b3e12c4d5f67890ab12cd34ef56789ab12cd34ef567890abcdef1234567890
   JWT_REFRESH_SECRET=dd59420dab96a267990baebb81693fa483e0ec4c94dff00fc1294e2f6dfc4c260acf18e739af4c735e1dd5ccbf142f6417e6c72593eb78192f5c903d6cc74113
   CLOUDINARY_CLOUD_NAME=dz7ohmykw
   CLOUDINARY_API_KEY=569117269226547
   CLOUDINARY_API_SECRET=3v9ffXGKuAiSyQ73s8hFbWAFHjQ
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://petconnect-backend.onrender.com`

### Option B: Railway

1. **Create Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure:**
   - Root Directory: `backend`
   - Start Command: `bun run start`
   - Add all environment variables

4. **Deploy:**
   - Railway will auto-deploy
   - Get your URL from the dashboard

---

## 🌐 Part 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Create Account:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select `frontend` as root directory

3. **Configure Build:**
   ```
   Framework Preset: Vite
   Build Command: bun run build
   Output Directory: dist
   Install Command: bun install
   ```

4. **Environment Variables:**
   ```
   VITE_API_URL=https://petconnect-backend.onrender.com/api
   ```

5. **Update Frontend API Configuration:**
   
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://petconnect-backend.onrender.com/api
   ```

   Update `frontend/src/services/api.ts`:
   ```typescript
   import axios from 'axios'

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || '/api',
   })

   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token')
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
     return config
   })

   export default api
   ```

6. **Deploy:**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your app will be live at: `https://petconnect.vercel.app`

### Option B: Netlify

1. **Create Account:**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **New Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select repository

3. **Build Settings:**
   ```
   Base directory: frontend
   Build command: bun run build
   Publish directory: frontend/dist
   ```

4. **Environment Variables:**
   Add `VITE_API_URL` with your backend URL

5. **Deploy:**
   - Click "Deploy site"
   - Site will be live in minutes

---

## 🔧 Part 4: Update Backend CORS

Update `backend/src/server.ts` to allow your frontend domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://petconnect.vercel.app', // Your Vercel domain
    'https://your-custom-domain.com' // If you have one
  ],
  credentials: true
}))
```

---

## 📝 Part 5: Post-Deployment Checklist

### Backend Health Check:
```bash
curl https://petconnect-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"PetConnect API is running"}
```

### Test Authentication:
```bash
curl -X POST https://petconnect-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "PET_OWNER"
  }'
```

### Frontend Checks:
1. Visit your Vercel URL
2. Try signing up
3. Test all features:
   - Rescue Map
   - Nearby Services
   - Lost & Found
   - Adoptions
   - Pet Store
   - Profile

---

## 🔐 Security Best Practices

### 1. Environment Variables:
- ✅ Never commit `.env` to Git
- ✅ Use different secrets for production
- ✅ Rotate JWT secrets regularly

### 2. MongoDB Atlas:
- ✅ Use strong passwords
- ✅ Enable IP whitelist (or 0.0.0.0/0 for cloud deployments)
- ✅ Enable MongoDB authentication

### 3. API Security:
- ✅ CORS configured for specific domains
- ✅ Rate limiting (add in future)
- ✅ Input validation on all endpoints

---

## 🌍 Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### For Backend (Render):
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS CNAME record
4. SSL auto-configured

---

## 📊 Monitoring & Logs

### Render:
- View logs in dashboard
- Set up log drains for persistent logs

### Vercel:
- Real-time logs in dashboard
- Analytics available

### MongoDB Atlas:
- Performance monitoring
- Query profiler
- Alerts for issues

---

## 🔄 Continuous Deployment

Both Vercel and Render support auto-deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy:**
   - Vercel/Render detect changes
   - Automatically build and deploy
   - Live in minutes

---

## 💰 Cost Breakdown

### Free Tier (Current Setup):
- **MongoDB Atlas:** 512MB free
- **Cloudinary:** 25GB storage, 25GB bandwidth/month
- **Render:** 750 hours/month free
- **Vercel:** Unlimited deployments

### Paid Tier (When Scaling):
- **MongoDB Atlas:** $9/month (2GB)
- **Cloudinary:** $89/month (100GB)
- **Render:** $7/month per service
- **Vercel:** $20/month (Pro)

---

## 🐛 Troubleshooting

### Backend Won't Start:
- Check environment variables
- Verify MongoDB connection string
- Check Render logs

### Frontend Can't Connect:
- Verify VITE_API_URL is correct
- Check CORS settings
- Inspect browser console

### MongoDB Connection Error:
- Check IP whitelist (0.0.0.0/0)
- Verify username/password
- Test connection string locally

### Images Not Uploading:
- Verify Cloudinary credentials
- Check file size limits
- Test Cloudinary dashboard

---

## 📱 Mobile App (Future)

When ready for mobile:
1. Use React Native
2. Same backend API
3. Deploy to App Store / Play Store

---

## 🎉 You're Live!

Your PetConnect app is now deployed and accessible worldwide!

**Frontend:** https://petconnect.vercel.app
**Backend:** https://petconnect-backend.onrender.com
**Database:** MongoDB Atlas (Cloud)
**Media:** Cloudinary

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints with curl
4. Check MongoDB Atlas connection

---

**Last Updated:** December 2024
**Status:** Production Ready 🚀
