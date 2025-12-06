import { Router } from 'express'
import Pet from '../models/Pet.js'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js'

const router = Router()

// Create pet
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const pet = await Pet.create({
      ...req.body,
      ownerId: req.userId
    })
    
    res.status(201).json(pet)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get user's pets
router.get('/my-pets', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.userId }).sort({ createdAt: -1 })
    res.json(pets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('ownerId', 'name email')
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' })
    }
    
    res.json(pet)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update pet
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.userId })
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or not authorized' })
    }
    
    Object.assign(pet, req.body)
    await pet.save()
    
    res.json(pet)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete pet
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, ownerId: req.userId })
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or not authorized' })
    }
    
    res.json({ message: 'Pet deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
