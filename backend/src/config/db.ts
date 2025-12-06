import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petconnect', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message)
    console.log('⚠️  Retrying connection in 5 seconds...')
    setTimeout(connectDB, 5000)
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message)
})
