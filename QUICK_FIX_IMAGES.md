# 🚀 Quick Fix: Pet Store Images Not Showing

## Problem
Sample photos in the Pet Store are not visible.

## Solution (3 Steps)

### 1️⃣ Start Backend
```bash
cd backend
npm run dev
```

### 2️⃣ Login as Admin
- Go to http://localhost:3000
- Login with admin credentials
- Open browser console (F12)

### 3️⃣ Run This in Console
```javascript
fetch('http://localhost:5001/api/admin/update-product-images', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Done!', data))
```

### 4️⃣ Refresh Store Page
Press Ctrl+R (or Cmd+R on Mac) to reload the Pet Store page.

## ✅ Result
All 18 products will now show proper images from Unsplash!

## What Changed?
- ✅ Updated all image URLs with proper format parameters
- ✅ Added fallback placeholders for failed images
- ✅ Created admin endpoint to update images easily
- ✅ No need to re-seed database

## Files Modified
- `backend/src/routes/admin.routes.ts` - Added update endpoint
- `backend/src/utils/seedProducts.ts` - Updated image URLs
- `backend/src/utils/updateProductImages.ts` - Updated image URLs
- `frontend/src/routes/Store/Store.tsx` - Added image fallback
- `frontend/src/routes/Store/ProductDetail.tsx` - Added image fallback

---

**Need more details?** See `STORE_IMAGES_GUIDE.md` for complete documentation.
