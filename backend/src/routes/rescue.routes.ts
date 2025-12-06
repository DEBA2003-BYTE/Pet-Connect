import { Router } from 'express'
import RescueReport from '../models/RescueReport.js'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { 
      animalType, 
      injuryDescription, 
      severity,
      location, 
      address,
      photos,
      contactNumber,
      safetyWarnings,
      isAnonymous
    } = req.body
    
    // Generate unique case number
    const count = await RescueReport.countDocuments()
    const caseNumber = `RC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`
    
    const rescue = await RescueReport.create({
      caseNumber,
      reporterId: isAnonymous ? undefined : req.userId,
      isAnonymous: isAnonymous || false,
      animalType,
      injuryDescription,
      severity: severity || 'MODERATE',
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      address,
      photos: photos || [],
      contactNumber,
      safetyWarnings: safetyWarnings || {
        isAggressive: false,
        onRoad: false,
        isBleeding: false
      },
      statusHistory: [{
        status: 'OPEN',
        timestamp: new Date()
      }]
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

router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, rescuerNotes } = req.body
    
    const rescue = await RescueReport.findById(req.params.id)
    if (!rescue) {
      return res.status(404).json({ message: 'Rescue not found' })
    }

    // Update status
    rescue.status = status
    
    // If accepting, assign to current user
    if (status === 'ACCEPTED') {
      const mongoose = await import('mongoose')
      rescue.assignedTo = new mongoose.Types.ObjectId(req.userId)
    }
    
    // If resolving, add notes and timestamp
    if (status === 'RESOLVED') {
      rescue.resolvedAt = new Date()
      if (rescuerNotes) {
        rescue.rescuerNotes = rescuerNotes
      }
    }
    
    // Add to status history
    const mongoose = await import('mongoose')
    rescue.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: new mongoose.Types.ObjectId(req.userId),
      notes: rescuerNotes
    })
    
    await rescue.save()
    
    const populatedRescue = await RescueReport.findById(rescue._id)
      .populate('reporterId', 'name phone')
      .populate('assignedTo', 'name phone')
    
    res.json(populatedRescue)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
