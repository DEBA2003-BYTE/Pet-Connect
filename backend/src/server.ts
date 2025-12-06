import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import rescueRoutes from './routes/rescue.routes'
import servicesRoutes from './routes/services.routes'
import lostFoundRoutes from './routes/lostFound.routes'
import adoptionRoutes from './routes/adoption.routes'
import mediaRoutes from './routes/media.routes'
import storeRoutes from './routes/store.routes'

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PetConnect API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
