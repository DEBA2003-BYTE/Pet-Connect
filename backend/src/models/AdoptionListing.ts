import mongoose, { Schema, Document } from 'mongoose'

export interface IAdoptionListing extends Document {
  ngoId: mongoose.Types.ObjectId
  petName: string
  species: string
  age?: string
  gender?: string
  healthInfo?: string
  vaccinationStatus?: string
  photos: string[]
  location?: {
    type: string
    coordinates: [number, number]
  }
  status: 'AVAILABLE' | 'ON_HOLD' | 'ADOPTED'
  applications: Array<{
    applicantId: mongoose.Types.ObjectId
    message: string
    status: string
    appliedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const AdoptionListingSchema = new Schema<IAdoptionListing>({
  ngoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  petName: { type: String, required: true },
  species: { type: String, required: true },
  age: String,
  gender: String,
  healthInfo: String,
  vaccinationStatus: String,
  photos: [String],
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]
  },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'ON_HOLD', 'ADOPTED'],
    default: 'AVAILABLE'
  },
  applications: [{
    applicantId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    status: String,
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

export default mongoose.model<IAdoptionListing>('AdoptionListing', AdoptionListingSchema)
