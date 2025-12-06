import mongoose, { Schema, Document } from 'mongoose'

interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
  price: number
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  updatedAt: Date
}

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }]
}, { timestamps: true })

export default mongoose.model<ICart>('Cart', CartSchema)
