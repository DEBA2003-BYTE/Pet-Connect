import mongoose from 'mongoose'
import Product from '../models/Product'
import dotenv from 'dotenv'

dotenv.config()

const imageUpdates: Record<string, string[]> = {
  'Drools Chicken & Rice Adult Dog Food': ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'],
  'Whiskas Ocean Fish Kitten Food (Dry)': ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500', 'https://images.unsplash.com/photo-1591768575557-5973a0e90f8f?w=500'],
  'Vitapol Complete Rabbit Pellets': ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500'],
  'Kong Classic Chew Toy (Dog)': ['https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500', 'https://images.unsplash.com/photo-1591856378301-5c3a7f2e4c8f?w=500'],
  'Catnip Mouse Toy': ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500'],
  'Rope Tug Toy': ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500'],
  'Adjustable Nylon Dog Harness': ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500'],
  'Reflective Leash (1.5m)': ['https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500'],
  'Soft Plush Pet Bed (Medium)': ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=500', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500'],
  'Himalaya Gentle Puppy Shampoo': ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
  'Steel Grooming Brush': ['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500'],
  'Nail Clipper with Safety Guard': ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'],
  'Calcium Tablets for Dogs': ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'],
  'Flea & Tick Control Drops': ['https://images.unsplash.com/photo-1587559070757-f72a388eebe5?w=500'],
  'Probiotic Digestive Syrup': ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500'],
  'Training Treats (Chicken Bites)': ['https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500'],
  'Potty Training Bell': ['https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500'],
  'Dog Training Guidebook': ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500']
}

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '')
    console.log('Connected to MongoDB')

    for (const [productName, images] of Object.entries(imageUpdates)) {
      const result = await Product.updateOne(
        { name: productName },
        { $set: { images } }
      )
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${productName}`)
      } else {
        console.log(`⚠️  Not found: ${productName}`)
      }
    }

    console.log('\n🎉 All product images updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error updating images:', error)
    process.exit(1)
  }
}

updateImages()
