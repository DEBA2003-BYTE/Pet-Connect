import { Router } from 'express'
import AdoptionListing from '../models/AdoptionListing'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { petName, species, age, gender, healthInfo, vaccinationStatus, photos, location } = req.body
    
    console.log('Creating adoption listing:', { petName, species, userId: req.userId })
    
    const adoption = await AdoptionListing.create({
      ngoId: req.userId,
      petName,
      species,
      age,
      gender,
      healthInfo,
      vaccinationStatus,
      photos: photos || [],
      location: location ? { type: 'Point', coordinates: location.coordinates } : undefined
    })

    res.status(201).json(adoption)
  } catch (error) {
    console.error('Error creating adoption listing:', error)
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/', async (req, res) => {
  try {
    const { status, species } = req.query
    const query: any = {}
    
    if (status) query.status = status
    if (species) query.species = species

    console.log('Fetching adoptions with query:', query)
    
    const adoptions = await AdoptionListing.find(query)
      .populate('ngoId', 'name phone email')
      .sort({ createdAt: -1 })

    console.log(`Found ${adoptions.length} adoptions`)
    res.json(adoptions)
  } catch (error) {
    console.error('Error fetching adoptions:', error)
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/:id/apply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body
    
    const adoption = await AdoptionListing.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          applications: {
            applicantId: req.userId,
            message,
            status: 'PENDING',
            appliedAt: new Date()
          }
        }
      },
      { new: true }
    )

    res.json(adoption)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
