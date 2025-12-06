import { Router } from 'express'
import Event from '../models/Event.js'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js'

const router = Router()

// Create event
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.userId,
      location: {
        type: 'Point',
        coordinates: req.body.location.coordinates
      }
    })
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizerId', 'name email phone')
    
    res.status(201).json(populatedEvent)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get all events
router.get('/', async (req, res) => {
  try {
    const { type, upcoming, featured } = req.query
    const query: any = { isActive: true }
    
    if (type) query.type = type
    if (featured === 'true') query.isFeatured = true
    if (upcoming === 'true') query.startDate = { $gte: new Date() }
    
    const events = await Event.find(query)
      .populate('organizerId', 'name email phone')
      .sort({ startDate: 1 })
    
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email phone')
      .populate('registrations.userId', 'name email phone')
      .populate('registrations.petId', 'name species breed photos')
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Register for event
router.post('/:id/register', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { petId } = req.body
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    // Check if already registered
    const alreadyRegistered = event.registrations.some(
      r => r.userId.toString() === req.userId
    )
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' })
    }
    
    // Check max participants
    if (event.maxParticipants && event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' })
    }
    
    // Check registration deadline
    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' })
    }
    
    const mongoose = await import('mongoose')
    event.registrations.push({
      userId: new mongoose.Types.ObjectId(req.userId),
      petId: petId ? new mongoose.Types.ObjectId(petId) : undefined,
      registeredAt: new Date(),
      status: 'PENDING',
      paymentStatus: event.registrationFee && event.registrationFee > 0 ? 'PENDING' : 'PAID'
    })
    
    await event.save()
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizerId', 'name email phone')
      .populate('registrations.userId', 'name email')
    
    res.json(populatedEvent)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Cancel registration
router.delete('/:id/register', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    event.registrations = event.registrations.filter(
      r => r.userId.toString() !== req.userId
    )
    
    await event.save()
    res.json({ message: 'Registration cancelled successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get user's registered events
router.get('/user/registered', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const events = await Event.find({
      'registrations.userId': req.userId,
      isActive: true
    })
      .populate('organizerId', 'name email phone')
      .sort({ startDate: 1 })
    
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
