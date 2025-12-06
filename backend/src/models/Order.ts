import mongoose, { Schema, Document } from 'mongoose'

interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  quantity: number
  price: number
  image: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  orderNumber: string
  items: IOrderItem[]
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    pincode: string
  }
  paymentMethod: 'COD' | 'ONLINE'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING'
  }
}, { timestamps: true })

OrderSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model<IOrder>('Order', OrderSchema)
