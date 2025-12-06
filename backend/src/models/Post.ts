import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId
  content: string
  images: string[]
  likes: mongoose.Types.ObjectId[]
  shares: mongoose.Types.ObjectId[]
  comments: Array<{
    userId: mongoose.Types.ObjectId
    text: string
    createdAt: Date
  }>
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE'
  isEdited: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  visibility: { 
    type: String, 
    enum: ['PUBLIC', 'FOLLOWERS', 'PRIVATE'],
    default: 'PUBLIC'
  },
  isEdited: { type: Boolean, default: false }
}, { timestamps: true })

// Index for faster queries
PostSchema.index({ authorId: 1, createdAt: -1 })
PostSchema.index({ createdAt: -1 })

export default mongoose.model<IPost>('Post', PostSchema)
