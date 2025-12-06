# 🏪 Seller Dashboard - Complete Guide

## Overview

Service Providers can now add and manage their own:
- **Services** (Vets, Clinics, Groomers, etc.) - Shown in "Nearby Services"
- **Products** (Food, Toys, Accessories, etc.) - Shown in "Pet Store"

## Access Requirements

**Role Required**: `SERVICE_PROVIDER`

Users with this role will see a "🏪 Seller" link in the navigation bar.

## Features

### 1. My Listings Tab
- View all your products and services
- Toggle product active/inactive status
- Delete products
- See product stats (stock, price, status)
- See service details (address, phone, verification status)

### 2. Add Service Tab
**Create a new service location:**
- Service name (e.g., "Happy Paws Veterinary Clinic")
- Service type (VET, CLINIC_24X7, GROOMER, TRAINER, PARK, CAFE, BOARDING)
- Full address
- Phone number
- Website (optional)
- Description
- Operating hours
- **Interactive map** to select exact location
- "Use Current Location" button for quick setup

**Features:**
- Draggable map marker for precise location
- Click anywhere on map to set location
- GPS auto-detection

### 3. Add Product Tab
**Create a new product listing:**

**Basic Information:**
- Product name
- Description
- Category (FOOD, TOYS, ACCESSORIES, GROOMING, HEALTH, TRAINING)
- Brand

**Pricing & Stock:**
- Price (₹)
- Discount price (optional)
- Stock quantity

**Product Images:**
- Upload up to 5 images via Cloudinary
- Drag and drop support
- Preview and remove images

**Specifications:**
- Pet type (Dog, Cat, Bird, Rabbit, Fish, Other)
- Weight/Size
- Age group (Puppy/Kitten, Adult, Senior)

**Category-Specific Fields:**

*For FOOD:*
- Food type (Dry, Wet, Grain-free)
- Breed size (Small, Medium, Large)
- Ingredients
- Usage instructions

*For TOYS:*
- Material (Rubber, Foam, Rope, Plush)

**Additional Options:**
- Enable subscription (recurring orders)
- Subscription discount percentage
- Tags (comma-separated for search)

## How to Access

### For Existing Users
1. Login to your account
2. If you're a SERVICE_PROVIDER, you'll see "🏪 Seller" in the nav bar
3. Click it to access the Seller Dashboard

### For New Users
1. Sign up with role: `SERVICE_PROVIDER`
2. Login
3. Access Seller Dashboard from navigation

### Upgrade Existing Account
If you're not a SERVICE_PROVIDER, contact admin to upgrade your account role.

## API Endpoints Used

### Services
- `POST /api/services` - Create new service
- `GET /api/services/my-services` - Get seller's services
- `GET /api/services/nearby` - Public endpoint (shows all services)

### Products
- `POST /api/store/products` - Create new product
- `GET /api/store/products?sellerId=me` - Get seller's products
- `PATCH /api/store/products/:id` - Update product
- `DELETE /api/store/products/:id` - Delete product

## Workflow Example

### Adding a Veterinary Clinic

1. Go to Seller Dashboard
2. Click "Add Service" tab
3. Fill in details:
   ```
   Name: Happy Paws Veterinary Clinic
   Type: VET
   Address: 123 Main Street, Delhi
   Phone: 9876543210
   Website: https://happypaws.com
   Description: 24/7 emergency care for all pets
   Operating Hours: Mon-Sun: 24 hours
   ```
4. Click "Use Current Location" or select on map
5. Submit
6. Service appears in "Nearby Services" for all users

### Adding a Dog Food Product

1. Go to Seller Dashboard
2. Click "Add Product" tab
3. Fill in details:
   ```
   Name: Premium Chicken & Rice Dog Food
   Description: High-protein dry kibble for adult dogs
   Category: FOOD
   Brand: MyBrand
   Price: 999
   Discount Price: 799
   Stock: 50
   ```
4. Upload product images
5. Select pet type: Dog
6. Fill specifications:
   ```
   Weight: 3kg
   Age Group: Adult
   Food Type: Dry
   Breed Size: Medium
   Ingredients: Chicken, Rice, Vitamins
   Usage: Feed 2-3 cups daily
   ```
7. Enable subscription with 10% discount
8. Add tags: dog, food, chicken, adult
9. Submit
10. Product appears in "Pet Store" for all users

## Product Visibility

**Active Products:**
- Shown in Pet Store
- Searchable
- Can be purchased

**Inactive Products:**
- Hidden from Pet Store
- Not searchable
- Cannot be purchased
- Still visible in "My Listings"

## Service Verification

Services can be verified by admins. Verified services show a "✓ Verified" badge.

## Best Practices

### For Services:
1. Use accurate location on map
2. Provide complete address
3. Add working phone number
4. Keep operating hours updated
5. Add website for more credibility

### For Products:
1. Upload high-quality images (at least 3)
2. Write detailed descriptions
3. Set competitive prices
4. Keep stock updated
5. Use relevant tags for better search
6. Fill all specifications
7. Offer subscription for recurring items (food, medicine)

## Tips for Success

1. **Complete Profile**: Fill all fields for better visibility
2. **Quality Images**: Use clear, well-lit product photos
3. **Accurate Stock**: Update stock regularly to avoid overselling
4. **Competitive Pricing**: Research market prices
5. **Good Descriptions**: Help customers make informed decisions
6. **Quick Response**: Monitor your listings and respond to inquiries
7. **Regular Updates**: Keep services and products current

## Troubleshooting

### Can't see Seller Dashboard?
- Check if you're logged in as SERVICE_PROVIDER
- Contact admin to upgrade your role

### Location not detecting?
- Allow browser location permissions
- Use manual map selection as fallback

### Images not uploading?
- Check image size (max 5MB)
- Verify Cloudinary configuration
- Check internet connection

### Product not showing in store?
- Ensure product is marked as "Active"
- Check if stock > 0
- Verify all required fields are filled

## Future Enhancements

- Order management for sellers
- Sales analytics dashboard
- Customer reviews management
- Bulk product upload
- Inventory alerts
- Promotional tools
- Seller ratings
- Commission tracking

---

**Ready to start selling? Access your Seller Dashboard now!** 🚀
