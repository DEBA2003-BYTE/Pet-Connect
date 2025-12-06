import mongoose, { Schema, Document } from 'mongoose'

export interface IAccessLog extends Document {
  userId?: mongoose.Types.ObjectId
  action: string
  resource: string
  method: string
  statusCode: number
  ipAddress: string
  userAgent: string
  timestamp: Date
}

const AccessLogSchema = new Schema<IAccessLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  method: { type: String, required: true },
  statusCode: { type: Number, required: true },
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
})

AccessLogSchema.index({ timestamp: -1 })
AccessLogSchema.index({ userId: 1, timestamp: -1 })

export default mongoose.model<IAccessLog>('AccessLog', AccessLogSchema)
