import mongoose, { Schema, Document } from 'mongoose'

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId
  category: 'RESCUE_MAP' | 'SERVICES' | 'LOST_FOUND' | 'ADOPTIONS' | 'PET_STORE' | 'COMMUNITY' | 'EVENTS' | 'PROFILE' | 'GENERAL'
  title: string
  content: string
  rating?: number
  isAnonymous: boolean
  upvotes: mongoose.Types.ObjectId[]
  downvotes: mongoose.Types.ObjectId[]
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'
  adminResponse?: string
  createdAt: Date
  updatedAt: Date
}

const FeedbackSchema = new Schema<IFeedback>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['RESCUE_MAP', 'SERVICES', 'LOST_FOUND', 'ADOPTIONS', 'PET_STORE', 'COMMUNITY', 'EVENTS', 'PROFILE', 'GENERAL'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  isAnonymous: { type: Boolean, default: false },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'],
    default: 'PENDING'
  },
  adminResponse: String
}, { timestamps: true })

// Indexes for faster queries
FeedbackSchema.index({ category: 1, createdAt: -1 })
FeedbackSchema.index({ status: 1 })

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema)
