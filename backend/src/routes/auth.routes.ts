import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { generateAccessToken } from '../utils/jwt'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, phone, city } = req.body
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'PET_OWNER',
      phone,
      city
    })

    const token = generateAccessToken(user._id.toString())
    
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateAccessToken(user._id.toString())
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
