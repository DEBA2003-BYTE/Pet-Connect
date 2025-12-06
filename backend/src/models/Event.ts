import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  organizerId: mongoose.Types.ObjectId
  title: string
  description: string
  type: 'COMPETITION' | 'VACCINATION_DRIVE' | 'ADOPTION_CAMP' | 'WORKSHOP' | 'MEETUP' | 'OTHER'
  images: string[]
  location: {
    type: string
    coordinates: [number, number]
  }
  address: string
  venue: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  registrationDeadline: Date
  maxParticipants?: number
  registrationFee?: number
  requirements?: string[]
  prizes?: string[]
  agenda?: string
  contactEmail?: string
  contactPhone?: string
  registrations: Array<{
    userId: mongoose.Types.ObjectId
    petId?: mongoose.Types.ObjectId
    registeredAt: Date
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED'
  }>
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['COMPETITION', 'VACCINATION_DRIVE', 'ADOPTION_CAMP', 'WORKSHOP', 'MEETUP', 'OTHER'],
    required: true
  },
  images: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String, required: true },
  venue: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  maxParticipants: Number,
  registrationFee: { type: Number, default: 0 },
  requirements: [String],
  prizes: [String],
  agenda: String,
  contactEmail: String,
  contactPhone: String,
  registrations: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: Schema.Types.ObjectId, ref: 'Pet' },
    registeredAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING'
    }
  }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true })

// Index for geospatial queries
EventSchema.index({ location: '2dsphere' })
EventSchema.index({ startDate: 1 })
EventSchema.index({ type: 1 })

export default mongoose.model<IEvent>('Event', EventSchema)
