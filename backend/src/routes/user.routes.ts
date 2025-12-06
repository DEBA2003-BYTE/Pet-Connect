import { Router } from 'express'
import User from '../models/User'
import { authMiddleware } from '../middlewares/auth.middleware'
import bcrypt from 'bcryptjs'

const router = Router()

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, phone, city, location } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, city, location },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
