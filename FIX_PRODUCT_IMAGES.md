# Fix Product Images in Pet Store

## Problem
Product images in the Pet Store are not loading properly because the Unsplash URLs need proper formatting parameters.

## Solution Applied
Updated all product image URLs to include `&auto=format&fit=crop` parameters for better loading and display.

## How to Apply the Fix

### Option 1: Using Admin API Endpoint (Recommended)
1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Login as an admin user in the frontend

3. Use the browser console or a tool like Postman to call:
   ```
   POST http://localhost:5001/api/admin/update-product-images
   Headers: Authorization: Bearer <your-admin-token>
   ```

4. The endpoint will update all 18 products with proper image URLs

### Option 2: Re-seed Products
If you want to start fresh with all products:

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In another terminal, run the seed script:
   ```bash
   cd backend
   npx tsx src/utils/seedProducts.ts
   ```

Note: This will delete all existing products and create new ones.

## Updated Image URLs
All product images now use this format:
```
https://images.unsplash.com/photo-{id}?w=500&auto=format&fit=crop
```

The `auto=format&fit=crop` parameters ensure:
- Automatic format optimization (WebP when supported)
- Proper cropping to fit the specified dimensions
- Better loading performance

## Products Updated
- ✅ Drools Chicken & Rice Adult Dog Food
- ✅ Whiskas Ocean Fish Kitten Food (Dry)
- ✅ Vitapol Complete Rabbit Pellets
- ✅ Kong Classic Chew Toy (Dog)
- ✅ Catnip Mouse Toy
- ✅ Rope Tug Toy
- ✅ Adjustable Nylon Dog Harness
- ✅ Reflective Leash (1.5m)
- ✅ Soft Plush Pet Bed (Medium)
- ✅ Himalaya Gentle Puppy Shampoo
- ✅ Steel Grooming Brush
- ✅ Nail Clipper with Safety Guard
- ✅ Calcium Tablets for Dogs
- ✅ Flea & Tick Control Drops
- ✅ Probiotic Digestive Syrup
- ✅ Training Treats (Chicken Bites)
- ✅ Potty Training Bell
- ✅ Dog Training Guidebook

## Troubleshooting

### If images still don't load:
1. Check browser console for CORS errors
2. Verify the backend is running on port 5001
3. Check if MongoDB connection is working
4. Try clearing browser cache
5. Verify the product data in MongoDB has the updated image URLs

### MongoDB Connection Issues:
If you see `EREFUSED` errors when running scripts directly:
- This is a DNS resolution issue with MongoDB Atlas
- Use the Admin API endpoint instead (Option 1 above)
- The backend server handles MongoDB connections better than standalone scripts
