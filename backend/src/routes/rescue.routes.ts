import { Router } from 'express'
import RescueReport from '../models/RescueReport'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { animalType, injuryDescription, location, photos } = req.body
    
    const rescue = await RescueReport.create({
      reporterId: req.userId,
      animalType,
      injuryDescription,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      photos: photos || []
    })

    res.status(201).json(rescue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query
    
    const rescues = await RescueReport.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000
        }
      }
    }).populate('reporterId', 'name phone')

    res.json(rescues)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const rescue = await RescueReport.findById(req.params.id)
      .populate('reporterId', 'name phone')
      .populate('assignedTo', 'name phone')
    
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue not found' })
    }

    res.json(rescue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, assignedTo } = req.body
    
    const rescue = await RescueReport.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, ...(status === 'RESOLVED' && { resolvedAt: new Date() }) },
      { new: true }
    )

    res.json(rescue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
