import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import rescueRoutes from './routes/rescue.routes.js'
import servicesRoutes from './routes/services.routes.js'
import lostFoundRoutes from './routes/lostFound.routes.js'
import adoptionRoutes from './routes/adoption.routes.js'
import mediaRoutes from './routes/media.routes.js'
import storeRoutes from './routes/store.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import adminRoutes from './routes/admin.routes.js'
import communityRoutes from './routes/community.routes.js'
import eventsRoutes from './routes/events.routes.js'
import petsRoutes from './routes/pets.routes.js'
import feedbackRoutes from './routes/feedback.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rescues', rescueRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/lost-found', lostFoundRoutes)
app.use('/api/adoptions', adoptionRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/pets', petsRoutes)
app.use('/api/feedback', feedbackRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PetConnect API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
