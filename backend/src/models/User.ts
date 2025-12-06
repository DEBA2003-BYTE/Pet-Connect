import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: 'PET_OWNER' | 'NGO' | 'VET' | 'VOLUNTEER' | 'SERVICE_PROVIDER' | 'ADMIN'
  phone?: string
  city?: string
  location?: {
    type: string
    coordinates: [number, number]
  }
  isVerified: boolean
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['PET_OWNER', 'NGO', 'VET', 'VOLUNTEER', 'SERVICE_PROVIDER', 'ADMIN'],
    default: 'PET_OWNER'
  },
  phone: String,
  city: String,
  isBlocked: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true })

UserSchema.index({ location: '2dsphere' })

export default mongoose.model<IUser>('User', UserSchema)
