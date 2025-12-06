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
  }
  ratings: {
    average: number
    count: number
  }
  sellerId: mongoose.Types.ObjectId
  isActive: boolean
  tags: string[]
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
    petType: [String]
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true })

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })
ProductSchema.index({ category: 1, price: 1 })

export default mongoose.model<IProduct>('Product', ProductSchema)
