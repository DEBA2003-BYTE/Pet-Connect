import mongoose from 'mongoose'
import Product from '../models/Product'
import User from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

const sampleProducts = [
  // FOOD Category
  {
    name: 'Drools Chicken & Rice Adult Dog Food',
    description: 'High-protein dry kibble for adult dogs. Made with real chicken and rice for optimal nutrition and energy.',
    category: 'FOOD',
    price: 799,
    discountPrice: 711,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
    specifications: {
      brand: 'Drools',
      weight: '3kg',
      ageGroup: 'Adult',
      petType: ['Dog'],
      foodType: 'Dry',
      ingredients: 'Chicken, Rice, Corn, Vitamins, Minerals',
      usageInstructions: 'Feed 2-3 cups daily based on dog weight. Always provide fresh water.'
    },
    ratings: { average: 4.5, count: 234 },
    isBestseller: true,
    isNewArrival: false,
    isFeatured: true,
    tags: ['dog', 'food', 'chicken', 'adult', 'dry'],
    subscriptionAvailable: true,
    subscriptionDiscount: 10
  },
  {
    name: 'Whiskas Ocean Fish Kitten Food (Dry)',
    description: 'Balanced nutrition for growing kittens with real ocean fish. Supports healthy growth and development.',
    category: 'FOOD',
    price: 649,
    discountPrice: 584,
    stock: 38,
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'https://images.unsplash.com/photo-1591768575557-5973a0e90f8f?w=500'],
    specifications: {
      brand: 'Whiskas',
      weight: '2kg',
      ageGroup: 'Puppy',
      petType: ['Cat'],
      foodType: 'Dry',
      ingredients: 'Ocean Fish, Chicken, Cereals, Vitamins',
      usageInstructions: 'Feed 3-4 times daily for kittens under 6 months.'
    },
    ratings: { average: 4.7, count: 189 },
    isBestseller: true,
    tags: ['cat', 'kitten', 'food', 'fish', 'dry'],
    subscriptionAvailable: true,
    subscriptionDiscount: 10
  },
  {
    name: 'Vitapol Complete Rabbit Pellets',
    description: 'Fibre-rich daily rabbit diet with essential vitamins and minerals for optimal health.',
    category: 'FOOD',
    price: 299,
    stock: 52,
    images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500'],
    specifications: {
      brand: 'Vitapol',
      weight: '1kg',
      petType: ['Rabbit'],
      foodType: 'Dry',
      ingredients: 'Timothy Hay, Alfalfa, Vegetables, Vitamins',
      usageInstructions: 'Feed 1/4 cup daily along with fresh hay.'
    },
    ratings: { average: 4.3, count: 67 },
    tags: ['rabbit', 'food', 'pellets', 'fiber'],
    subscriptionAvailable: true
  },

  // TOYS Category
  {
    name: 'Kong Classic Chew Toy (Dog)',
    description: 'Durable rubber chew toy for dogs. Perfect for aggressive chewers and can be stuffed with treats.',
    category: 'TOYS',
    price: 499,
    stock: 67,
    images: ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500', 'https://images.unsplash.com/photo-1591856378301-5c3a7f2e4c8f?w=500'],
    specifications: {
      brand: 'Kong',
      material: 'Rubber',
      size: 'Medium',
      petType: ['Dog'],
      ageGroup: 'Adult'
    },
    ratings: { average: 4.6, count: 312 },
    isBestseller: true,
    tags: ['dog', 'toy', 'chew', 'rubber', 'durable']
  },
  {
    name: 'Catnip Mouse Toy',
    description: 'Soft toy infused with organic catnip. Keeps cats entertained for hours.',
    category: 'TOYS',
    price: 149,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500'],
    specifications: {
      brand: 'PetPlay',
      material: 'Plush',
      size: 'Small',
      petType: ['Cat']
    },
    ratings: { average: 4.2, count: 156 },
    tags: ['cat', 'toy', 'catnip', 'plush', 'mouse']
  },
  {
    name: 'Rope Tug Toy',
    description: 'Ideal for tug-of-war and chewing. Helps clean teeth naturally.',
    category: 'TOYS',
    price: 199,
    stock: 89,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'],
    specifications: {
      brand: 'PetPlay',
      material: 'Rope',
      size: 'Medium',
      petType: ['Dog']
    },
    ratings: { average: 4.4, count: 98 },
    tags: ['dog', 'toy', 'rope', 'tug', 'dental']
  },

  // ACCESSORIES Category
  {
    name: 'Adjustable Nylon Dog Harness',
    description: 'Breathable, secure no-pull harness. Perfect for daily walks and training.',
    category: 'ACCESSORIES',
    price: 699,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500'],
    specifications: {
      brand: 'PetSafe',
      size: 'M',
      color: 'Black',
      material: 'Nylon',
      petType: ['Dog']
    },
    ratings: { average: 4.5, count: 203 },
    isFeatured: true,
    tags: ['dog', 'harness', 'walk', 'nylon', 'adjustable']
  },
  {
    name: 'Reflective Leash (1.5m)',
    description: 'Night-safe reflective walking leash. Strong and durable for all dog sizes.',
    category: 'ACCESSORIES',
    price: 299,
    stock: 78,
    images: ['https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500'],
    specifications: {
      brand: 'PetSafe',
      size: '1.5m',
      color: 'Blue',
      material: 'Nylon',
      petType: ['Dog']
    },
    ratings: { average: 4.4, count: 167 },
    tags: ['dog', 'leash', 'reflective', 'walk', 'safety']
  },
  {
    name: 'Soft Plush Pet Bed (Medium)',
    description: 'Cozy washable bed for dogs & cats. Orthopedic support for joint health.',
    category: 'ACCESSORIES',
    price: 1299,
    discountPrice: 1039,
    stock: 23,
    images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=500', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500'],
    specifications: {
      brand: 'ComfyPet',
      size: 'Medium',
      color: 'Grey',
      material: 'Plush',
      petType: ['Dog', 'Cat']
    },
    ratings: { average: 4.6, count: 145 },
    isBestseller: true,
    tags: ['bed', 'sleep', 'comfort', 'washable', 'orthopedic']
  },

  // GROOMING Category
  {
    name: 'Himalaya Gentle Puppy Shampoo',
    description: 'Tear-free natural shampoo for puppies. Made with aloe vera and coconut oil.',
    category: 'GROOMING',
    price: 225,
    stock: 95,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
    specifications: {
      brand: 'Himalaya',
      weight: '200ml',
      petType: ['Dog'],
      ageGroup: 'Puppy',
      usageInstructions: 'Wet coat, apply shampoo, massage, rinse thoroughly.'
    },
    ratings: { average: 4.5, count: 178 },
    tags: ['shampoo', 'puppy', 'grooming', 'natural', 'tear-free']
  },
  {
    name: 'Steel Grooming Brush',
    description: 'Removes loose fur and detangles. Suitable for all coat types.',
    category: 'GROOMING',
    price: 159,
    stock: 112,
    images: ['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500'],
    specifications: {
      brand: 'PetGroomer',
      material: 'Steel',
      petType: ['Dog', 'Cat']
    },
    ratings: { average: 4.2, count: 89 },
    tags: ['brush', 'grooming', 'fur', 'detangle', 'steel']
  },
  {
    name: 'Nail Clipper with Safety Guard',
    description: 'Stainless steel with anti-slip handle. Safe and easy to use.',
    category: 'GROOMING',
    price: 199,
    stock: 67,
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'],
    specifications: {
      brand: 'PetGroomer',
      material: 'Steel',
      petType: ['Dog', 'Cat']
    },
    ratings: { average: 4.3, count: 134 },
    tags: ['nail', 'clipper', 'grooming', 'safety', 'steel']
  },

  // HEALTH Category
  {
    name: 'Calcium Tablets for Dogs',
    description: 'Supports bone health & growth. Essential for puppies and senior dogs.',
    category: 'HEALTH',
    price: 349,
    stock: 58,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'],
    specifications: {
      brand: 'PetHealth',
      weight: '60 tablets',
      petType: ['Dog'],
      usageInstructions: '1 tablet daily with food.'
    },
    ratings: { average: 4.6, count: 201 },
    tags: ['health', 'calcium', 'supplement', 'bones', 'tablets'],
    subscriptionAvailable: true,
    subscriptionDiscount: 15
  },
  {
    name: 'Flea & Tick Control Drops',
    description: '1-month protection from ticks and fleas. Waterproof formula.',
    category: 'HEALTH',
    price: 499,
    stock: 42,
    images: ['https://images.unsplash.com/photo-1587559070757-f72a388eebe5?w=500'],
    specifications: {
      brand: 'PetHealth',
      weight: '1ml',
      petType: ['Dog', 'Cat'],
      usageInstructions: 'Apply on back of neck once monthly.'
    },
    ratings: { average: 4.4, count: 167 },
    tags: ['health', 'flea', 'tick', 'protection', 'drops'],
    subscriptionAvailable: true
  },
  {
    name: 'Probiotic Digestive Syrup',
    description: 'For loose stool & gut issues. Natural and safe for all ages.',
    category: 'HEALTH',
    price: 299,
    stock: 73,
    images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500'],
    specifications: {
      brand: 'PetHealth',
      weight: '100ml',
      petType: ['Dog', 'Cat'],
      usageInstructions: '5ml twice daily or as directed by vet.'
    },
    ratings: { average: 4.5, count: 123 },
    tags: ['health', 'probiotic', 'digestive', 'gut', 'syrup']
  },

  // TRAINING Category
  {
    name: 'Training Treats (Chicken Bites)',
    description: 'High-reward soft dog treats. Perfect for positive reinforcement training.',
    category: 'TRAINING',
    price: 249,
    stock: 87,
    images: ['https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500'],
    specifications: {
      brand: 'TrainRight',
      weight: '200g',
      petType: ['Dog'],
      ingredients: 'Chicken, Rice Flour, Glycerin',
      usageInstructions: 'Use as rewards during training sessions.'
    },
    ratings: { average: 4.7, count: 245 },
    isBestseller: true,
    tags: ['training', 'treats', 'chicken', 'reward', 'soft']
  },
  {
    name: 'Potty Training Bell',
    description: 'Teaches dogs to signal when they need to go out. Easy to install.',
    category: 'TRAINING',
    price: 199,
    stock: 64,
    images: ['https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500'],
    specifications: {
      brand: 'TrainRight',
      material: 'Metal',
      petType: ['Dog']
    },
    ratings: { average: 4.4, count: 98 },
    tags: ['training', 'potty', 'bell', 'housebreaking', 'signal']
  },
  {
    name: 'Dog Training Guidebook',
    description: 'Step-by-step behavior training manual. Covers basic commands to advanced tricks.',
    category: 'TRAINING',
    price: 349,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    specifications: {
      brand: 'TrainRight',
      petType: ['Dog']
    },
    ratings: { average: 4.3, count: 76 },
    isNewArrival: true,
    tags: ['training', 'book', 'guide', 'behavior', 'commands']
  }
]

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '')
    console.log('Connected to MongoDB')

    // Find a user to be the seller (or create a default one)
    let seller = await User.findOne({ role: 'SERVICE_PROVIDER' })
    
    if (!seller) {
      console.log('No seller found, creating default seller...')
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('password123', 10)
      seller = await User.create({
        name: 'PetConnect Store',
        email: 'store@petconnect.com',
        passwordHash: hashedPassword,
        phone: '9999999999',
        role: 'SERVICE_PROVIDER'
      })
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert sample products
    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      sellerId: seller!._id,
      isActive: true
    }))

    await Product.insertMany(productsWithSeller)
    console.log(`✅ Successfully seeded ${sampleProducts.length} products!`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
