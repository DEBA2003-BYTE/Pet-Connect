import { Router } from 'express'
import ServiceLocation from '../models/ServiceLocation'

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

export default router
