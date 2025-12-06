import { Router } from 'express'
import LostFound from '../models/LostFound'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, petType, breed, color, description, uniqueMarks, lastSeenLocation, lastSeenTime, photos } = req.body
    
    const lostFound = await LostFound.create({
      ownerId: req.userId,
      status,
      petType,
      breed,
      color,
      description,
      uniqueMarks,
      lastSeenLocation: {
        type: 'Point',
        coordinates: lastSeenLocation.coordinates
      },
      lastSeenTime,
      photos: photos || []
    })

    res.status(201).json(lostFound)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/', async (req, res) => {
  try {
    const { status, petType } = req.query
    const query: any = {}
    
    if (status) query.status = status
    if (petType) query.petType = petType

    const lostFoundPets = await LostFound.find(query)
      .populate('ownerId', 'name phone email')
      .sort({ createdAt: -1 })

    res.json(lostFoundPets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const lostFound = await LostFound.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(lostFound)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
