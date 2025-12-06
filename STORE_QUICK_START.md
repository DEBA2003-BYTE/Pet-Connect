# 🛒 Pet Store - Quick Start Guide

## Setup Instructions

### 1. Seed Sample Products

First, populate the database with 18 sample products:

```bash
cd backend
bun run seed
```

**Expected Output:**
```
Connected to MongoDB
Cleared existing products
✅ Successfully seeded 18 products!
```

### 2. Start the Backend

```bash
cd backend
bun run dev
```

Backend will run on: `http://localhost:5001`

### 3. Start the Frontend

```bash
cd frontend
bun run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Access the Store

Navigate to: `http://localhost:3000/store`

## Features to Test

### 1. Browse Products
- Click on different category tabs (Food, Toys, Accessories, etc.)
- See products filtered by category
- Notice bestseller badges and discount tags

### 2. Search Products
- Type in the search bar (e.g., "dog", "cat", "toy")
- See auto-suggestions appear
- Click a suggestion to search

### 3. Apply Filters
- Click "🔍 Filters & Sort" button
- Try different sorting options:
  - Price: Low to High
  - Price: High to Low
  - Top Rated
  - Bestselling
- Set price range (e.g., Min: 200, Max: 500)
- For Food category, try:
  - Food Type: Dry/Wet
  - Age Group: Puppy/Adult/Senior
  - Breed Size: Small/Medium/Large
- For Toys category, try:
  - Material: Rubber/Foam/Rope
- Enter a brand name (e.g., "Kong", "Whiskas")
- Click "Clear Filters" to reset

### 4. View Product Details
- Click on any product card
- See full product information:
  - Multiple images (click thumbnails to change)
  - Price with discount
  - Stock status
  - Specifications
  - Ingredients (for food)
  - Usage instructions
- Try the quantity selector (+/-)
- Notice low stock alert if stock < 5

### 5. Add to Cart
- Select quantity
- Click "🛒 Add to Cart"
- See success message
- Click "⚡ Buy Now" to add and go to cart

### 6. Wishlist
- Click the heart icon (🤍)
- It turns red (❤️) when added
- Click again to remove
- Wishlist persists across page refreshes

### 7. Write a Review
- On product detail page, click "Write a Review"
- Select star rating (1-5)
- Write your review
- Optionally upload photos (up to 3)
- Submit review
- See your review appear in the list
- Notice "✓ Verified Purchase" badge if you've ordered the product

### 8. View Recommendations
- Scroll to bottom of product detail page
- See "You May Also Like" section
- Click on suggested products

### 9. Subscription Products
- Look for products with "🔄 Subscribe & Save" badge
- These offer recurring delivery with discount

## Sample Products by Category

### 🍖 Food
- Drools Chicken & Rice Adult Dog Food (₹711)
- Whiskas Ocean Fish Kitten Food (₹584)
- Vitapol Complete Rabbit Pellets (₹299)

### 🎾 Toys
- Kong Classic Chew Toy (₹499)
- Catnip Mouse Toy (₹149)
- Rope Tug Toy (₹199)

### 🎀 Accessories
- Adjustable Nylon Dog Harness (₹699)
- Reflective Leash (₹299)
- Soft Plush Pet Bed (₹1,039)

### ✂️ Grooming
- Himalaya Gentle Puppy Shampoo (₹225)
- Steel Grooming Brush (₹159)
- Nail Clipper (₹199)

### 💊 Health
- Calcium Tablets (₹349)
- Flea & Tick Control Drops (₹499)
- Probiotic Digestive Syrup (₹299)

### 🎓 Training
- Training Treats (₹249)
- Potty Training Bell (₹199)
- Dog Training Guidebook (₹349)

## API Testing with cURL

### Get All Products
```bash
curl http://localhost:5001/api/store/products
```

### Get Products by Category
```bash
curl "http://localhost:5001/api/store/products?category=FOOD"
```

### Search Products
```bash
curl "http://localhost:5001/api/store/products?search=dog"
```

### Filter by Price Range
```bash
curl "http://localhost:5001/api/store/products?minPrice=200&maxPrice=500"
```

### Sort by Price
```bash
curl "http://localhost:5001/api/store/products?sort=price-asc"
```

### Get Single Product
```bash
curl http://localhost:5001/api/store/products/<product_id>
```

### Add to Cart (requires auth token)
```bash
curl -X POST http://localhost:5001/api/store/cart/add \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "<product_id>", "quantity": 2}'
```

### Get Cart
```bash
curl http://localhost:5001/api/store/cart \
  -H "Authorization: Bearer <your_token>"
```

### Add to Wishlist
```bash
curl -X POST http://localhost:5001/api/wishlist/add/<product_id> \
  -H "Authorization: Bearer <your_token>"
```

### Get Wishlist
```bash
curl http://localhost:5001/api/wishlist \
  -H "Authorization: Bearer <your_token>"
```

## Troubleshooting

### Products not showing?
- Make sure you ran `bun run seed` in the backend folder
- Check MongoDB connection in `.env` file
- Verify backend is running on port 5001

### Can't add to cart?
- Make sure you're logged in
- Check browser console for errors
- Verify auth token is valid

### Images not loading?
- Sample products use placeholder Cloudinary URLs
- Replace with actual image URLs after uploading to your Cloudinary account

### Search not working?
- MongoDB text index might need to be created
- Restart backend after seeding

## Next Steps

1. **Create Cart Page**: Display cart items, update quantities, proceed to checkout
2. **Create Checkout Page**: Shipping address, payment method, order summary
3. **Create Orders Page**: View order history, track orders
4. **Upload Real Images**: Replace placeholder images with actual product photos
5. **Add Payment Gateway**: Integrate Razorpay/Stripe for payments

## Tips

- Use Chrome DevTools to inspect API calls
- Check Network tab for API responses
- Use MongoDB Compass to view database
- Test on mobile devices for responsive design
- Try different user roles (buyer vs seller)

---

**Happy Testing! 🎉**
