import { Router } from 'express'
import ServiceLocation from '../models/ServiceLocation'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10, type } = req.query
    
    const query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000
        }
      }
    }

    if (type) {
      query.type = type
    }

    const services = await ServiceLocation.find(query)
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/types', (req, res) => {
  res.json(['VET', 'CLINIC_24X7', 'GROOMER', 'TRAINER', 'PARK', 'CAFE', 'BOARDING'])
})

// Create service (authenticated users)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const service = await ServiceLocation.create({
      ...req.body,
      addedBy: req.userId
    })
    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get user's own services
router.get('/my-services', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const services = await ServiceLocation.find({ addedBy: req.userId }).sort({ createdAt: -1 })
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update service
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const service = await ServiceLocation.findOne({ _id: req.params.id, addedBy: req.userId })
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' })
    }

    Object.assign(service, req.body)
    await service.save()

    res.json(service)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete service
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const service = await ServiceLocation.findOneAndDelete({ _id: req.params.id, addedBy: req.userId })
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found or unauthorized' })
    }

    res.json({ message: 'Service deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
