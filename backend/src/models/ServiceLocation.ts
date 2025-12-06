import mongoose, { Schema, Document } from 'mongoose'

export interface IServiceLocation extends Document {
  name: string
  type: 'VET' | 'CLINIC_24X7' | 'GROOMER' | 'TRAINER' | 'PARK' | 'CAFE' | 'BOARDING'
  location: {
    type: string
    coordinates: [number, number]
  }
  address: string
  phone?: string
  website?: string
  verifiedBy?: mongoose.Types.ObjectId
  isVerified: boolean
  rating?: number
  reviewCount?: number
}

const ServiceLocationSchema = new Schema<IServiceLocation>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['VET', 'CLINIC_24X7', 'GROOMER', 'TRAINER', 'PARK', 'CAFE', 'BOARDING'],
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String, required: true },
  phone: String,
  website: String,
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  rating: Number,
  reviewCount: Number
}, { timestamps: true })

ServiceLocationSchema.index({ location: '2dsphere' })

export default mongoose.model<IServiceLocation>('ServiceLocation', ServiceLocationSchema)
