import mongoose, { Schema, Document } from 'mongoose'

export interface IRescueReport extends Document {
  caseNumber: string
  reporterId?: mongoose.Types.ObjectId
  isAnonymous: boolean
  status: 'OPEN' | 'ACCEPTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'
  animalType: string
  injuryDescription: string
  severity: 'MINOR' | 'MODERATE' | 'SEVERE'
  location: {
    type: string
    coordinates: [number, number]
  }
  address?: string
  photos: string[]
  contactNumber?: string
  safetyWarnings: {
    isAggressive: boolean
    onRoad: boolean
    isBleeding: boolean
  }
  assignedTo?: mongoose.Types.ObjectId
  statusHistory: Array<{
    status: string
    timestamp: Date
    updatedBy?: mongoose.Types.ObjectId
    notes?: string
  }>
  estimatedArrival?: Date
  rescuerNotes?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

const RescueReportSchema = new Schema<IRescueReport>({
  caseNumber: { type: String, required: true, unique: true },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User' },
  isAnonymous: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['OPEN', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
    default: 'OPEN'
  },
  animalType: { type: String, required: true },
  injuryDescription: { type: String, required: true },
  severity: {
    type: String,
    enum: ['MINOR', 'MODERATE', 'SEVERE'],
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  address: String,
  photos: [String],
  contactNumber: String,
  safetyWarnings: {
    isAggressive: { type: Boolean, default: false },
    onRoad: { type: Boolean, default: false },
    isBleeding: { type: Boolean, default: false }
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: String
  }],
  estimatedArrival: Date,
  rescuerNotes: String,
  resolvedAt: Date
}, { timestamps: true })

RescueReportSchema.index({ location: '2dsphere' })
RescueReportSchema.index({ caseNumber: 1 })
RescueReportSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model<IRescueReport>('RescueReport', RescueReportSchema)
