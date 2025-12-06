# 🎯 Final System Requirements - Complete Implementation

## 📋 Requirements Summary

### 1. User Roles & Permissions

#### PET_OWNER (Default)
- ✅ Use all features
- ❌ Cannot resolve rescues
- ❌ Cannot upload products

#### VOLUNTEER
- ✅ Accept and resolve rescue reports
- ✅ Register in Services tab (add themselves as service providers)
- ✅ All PET_OWNER features

#### SALES PERSON (SERVICE_PROVIDER)
- ✅ Upload products to Pet Store
- ✅ Update product prices
- ✅ Manage all product features
- ✅ All PET_OWNER features

#### ADMIN
- ✅ Add "Admin" option in signup
- ✅ Credentials: username `petconnect@2025`, password `petconnect@2025`
- ✅ View and manage feedback (access logs)
- ✅ Block/unblock users
- ✅ Delete any profile
- ✅ Set product prices and price hikes
- ✅ **Revenue Section**: View 20% commission on all sales
- ✅ Full system access

### 2. Revenue System
- Sales person sets base price (e.g., ₹100)
- System adds 20% commission automatically
- Customer pays ₹120
- Revenue tracking for admin
- Payment integration with Razorpay

### 3. Lost & Found Updates
- ✅ Integrate Leaflet map for location
- ✅ Track current user location
- ✅ Show only nearby lost/found pets
- ✅ Location-based filtering

### 4. Pet Store Updates
- ✅ Filter by price range
- ✅ Sort by "Trending" (highest sellers)
- ✅ Track sales count per product
- ✅ Display bestsellers

### 5. Payment Integration
- ✅ Razorpay API integration
- ✅ Payment gateway for purchases
- ✅ Order tracking
- ✅ Revenue calculation

---

## 🚀 Implementation Plan

### Phase 1: Admin Role & Credentials ✅
1. Add ADMIN to signup options
2. Create default admin account
3. Update admin dashboard permissions

### Phase 2: Revenue System 💰
1. Update Product model with commission field
2. Add revenue tracking
3. Create admin revenue dashboard
4. Calculate 20% commission automatically

### Phase 3: Payment Integration 💳
1. Integrate Razorpay
2. Create payment routes
3. Handle payment callbacks
4. Update order status

### Phase 4: Lost & Found Location 📍
1. Add Leaflet map to Lost & Found
2. Implement geolocation
3. Add location-based filtering
4. Show distance from user

### Phase 5: Pet Store Enhancements 🛒
1. Add price range filter
2. Implement trending/bestseller sort
3. Track product sales
4. Update UI

### Phase 6: Volunteer Service Registration 👥
1. Allow volunteers to register as service providers
2. Add to Services tab
3. Update permissions

---

## 📊 Database Schema Updates

### Product Model
```typescript
{
  basePrice: Number,        // Set by sales person
  commission: Number,       // 20% default
  finalPrice: Number,       // basePrice + commission
  salesCount: Number,       // Track sales for trending
  revenue: Number,          // Total revenue generated
}
```

### Order Model
```typescript
{
  products: [...],
  totalAmount: Number,
  commissionAmount: Number,  // 20% of total
  paymentId: String,         // Razorpay payment ID
  paymentStatus: String,     // PENDING, PAID, FAILED
}
```

### LostFound Model
```typescript
{
  location: {
    type: 'Point',
    coordinates: [lng, lat]
  },
  address: String
}
```

---

## 🎨 UI Updates

### Admin Dashboard
- New "Revenue" tab
- Total revenue display
- Commission breakdown
- Sales analytics

### Pet Store
- Price range slider
- "Trending" sort option
- Bestseller badges
- Sales count display

### Lost & Found
- Interactive map
- Current location marker
- Distance display
- Location-based results

---

## 🔐 Admin Credentials

```
Username: petconnect@2025
Password: petconnect@2025
```

---

## 💳 Razorpay Integration

### Setup
1. Get Razorpay API keys
2. Add to .env file
3. Install razorpay package
4. Create payment routes

### Flow
1. User adds items to cart
2. Proceeds to checkout
3. Razorpay payment gateway opens
4. Payment processed
5. Order confirmed
6. Revenue tracked

---

## 📍 Location Features

### Lost & Found
- User location auto-detected
- Map shows all nearby pets
- Filter by distance (1km, 5km, 10km)
- Click marker for details

### Services
- Already has location features
- Can be enhanced similarly

---

## 🎯 Priority Order

1. **HIGH**: Admin role in signup
2. **HIGH**: Revenue system (20% commission)
3. **HIGH**: Price filters in Pet Store
4. **MEDIUM**: Razorpay integration
5. **MEDIUM**: Lost & Found location
6. **LOW**: Trending/bestseller features

---

**Status:** Planning Complete - Ready for Implementation

**Estimated Time:** 
- Phase 1: 30 minutes
- Phase 2: 1 hour
- Phase 3: 2 hours
- Phase 4: 1 hour
- Phase 5: 45 minutes
- Phase 6: 30 minutes

**Total:** ~5-6 hours of development
