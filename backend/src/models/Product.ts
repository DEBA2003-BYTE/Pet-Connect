import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  category: 'FOOD' | 'TOYS' | 'ACCESSORIES' | 'GROOMING' | 'HEALTH' | 'TRAINING'
  subCategory?: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  specifications: {
    brand?: string
    weight?: string
    size?: string
    color?: string
    material?: string
    ageGroup?: string
    petType?: string[]
    breedSize?: string
    foodType?: string
    ingredients?: string
    usageInstructions?: string
  }
  ratings: {
    average: number
    count: number
  }
  reviews: Array<{
    userId: mongoose.Types.ObjectId
    rating: number
    comment: string
    images?: string[]
    isVerifiedPurchase: boolean
    createdAt: Date
  }>
  sellerId: mongoose.Types.ObjectId
  isActive: boolean
  isBestseller: boolean
  isNewArrival: boolean
  isFeatured: boolean
  tags: string[]
  subscriptionAvailable: boolean
  subscriptionDiscount?: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['FOOD', 'TOYS', 'ACCESSORIES', 'GROOMING', 'HEALTH', 'TRAINING'],
    required: true 
  },
  subCategory: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  stock: { type: Number, required: true, default: 0 },
  images: [String],
  specifications: {
    brand: String,
    weight: String,
    size: String,
    color: String,
    material: String,
    ageGroup: String,
    petType: [String],
    breedSize: String,
    foodType: String,
    ingredients: String,
    usageInstructions: String
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  subscriptionAvailable: { type: Boolean, default: false },
  subscriptionDiscount: Number
}, { timestamps: true })

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ category: 1, price: 1 })

export default mongoose.model<IProduct>('Product', ProductSchema)
