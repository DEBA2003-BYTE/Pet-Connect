import mongoose, { Schema, Document } from 'mongoose'

export interface ILostFound extends Document {
  ownerId: mongoose.Types.ObjectId
  status: 'LOST' | 'FOUND' | 'RECOVERED'
  petType: string
  breed?: string
  color?: string
  description: string
  uniqueMarks?: string
  lastSeenLocation: {
    type: string
    coordinates: [number, number]
  }
  lastSeenTime: Date
  photos: string[]
  createdAt: Date
  updatedAt: Date
}

const LostFoundSchema = new Schema<ILostFound>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['LOST', 'FOUND', 'RECOVERED'],
    required: true
  },
  petType: { type: String, required: true },
  breed: String,
  color: String,
  description: { type: String, required: true },
  uniqueMarks: String,
  lastSeenLocation: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  lastSeenTime: { type: Date, required: true },
  photos: [String]
}, { timestamps: true })

LostFoundSchema.index({ lastSeenLocation: '2dsphere' })

export default mongoose.model<ILostFound>('LostFound', LostFoundSchema)
