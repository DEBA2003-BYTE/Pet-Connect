import mongoose, { Schema, Document } from 'mongoose'

export interface IRescueReport extends Document {
  reporterId?: mongoose.Types.ObjectId
  status: 'OPEN' | 'ACCEPTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'
  animalType: string
  injuryDescription: string
  location: {
    type: string
    coordinates: [number, number]
  }
  photos: string[]
  assignedTo?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

const RescueReportSchema = new Schema<IRescueReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['OPEN', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    default: 'OPEN'
  },
  animalType: { type: String, required: true },
  injuryDescription: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  photos: [String],
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date
}, { timestamps: true })

RescueReportSchema.index({ location: '2dsphere' })

export default mongoose.model<IRescueReport>('RescueReport', RescueReportSchema)
