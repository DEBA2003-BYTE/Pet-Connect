import mongoose, { Schema, Document } from 'mongoose'

export interface IPet extends Document {
  ownerId: mongoose.Types.ObjectId
  name: string
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER'
  breed?: string
  age?: number
  gender?: 'MALE' | 'FEMALE'
  color?: string
  weight?: number
  photos: string[]
  medicalHistory?: string
  vaccinations?: Array<{
    name: string
    date: Date
    nextDue?: Date
  }>
  microchipId?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const PetSchema = new Schema<IPet>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  species: {
    type: String,
    enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'OTHER'],
    required: true
  },
  breed: String,
  age: Number,
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE']
  },
  color: String,
  weight: Number,
  photos: [{ type: String }],
  medicalHistory: String,
  vaccinations: [{
    name: { type: String, required: true },
    date: { type: Date, required: true },
    nextDue: Date
  }],
  microchipId: String,
  description: String
}, { timestamps: true })

// Index for faster queries
PetSchema.index({ ownerId: 1 })

export default mongoose.model<IPet>('Pet', PetSchema)
