import { Router } from 'express'
import Feedback from '../models/Feedback.js'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js'

const router = Router()

// Create feedback (anonymous or authenticated)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { category, title, content, rating, isAnonymous } = req.body
    
    const feedback = await Feedback.create({
      userId: isAnonymous ? undefined : req.userId,
      category,
      title,
      content,
      rating,
      isAnonymous
    })
    
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'name')
    
    res.status(201).json(populatedFeedback)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const { category, status, sort } = req.query
    const query: any = {}
    
    if (category) query.category = category
    if (status) query.status = status
    
    let sortOption: any = { createdAt: -1 }
    if (sort === 'upvotes') {
      sortOption = { upvotes: -1, createdAt: -1 }
    } else if (sort === 'rating') {
      sortOption = { rating: -1, createdAt: -1 }
    }
    
    const feedbacks = await Feedback.find(query)
      .populate('userId', 'name')
      .sort(sortOption)
    
    // Calculate vote scores
    const feedbacksWithScores = feedbacks.map(fb => ({
      ...fb.toObject(),
      voteScore: fb.upvotes.length - fb.downvotes.length
    }))
    
    // Sort by vote score if requested
    if (sort === 'upvotes') {
      feedbacksWithScores.sort((a, b) => b.voteScore - a.voteScore)
    }
    
    res.json(feedbacksWithScores)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('userId', 'name email')
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    
    const feedbackWithScore = {
      ...feedback.toObject(),
      voteScore: feedback.upvotes.length - feedback.downvotes.length
    }
    
    res.json(feedbackWithScore)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Upvote feedback
router.post('/:id/upvote', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    
    const mongoose = await import('mongoose')
    const userObjectId = new mongoose.Types.ObjectId(req.userId)
    
    // Remove from downvotes if exists
    feedback.downvotes = feedback.downvotes.filter(
      id => id.toString() !== req.userId
    )
    
    // Toggle upvote
    const upvoteIndex = feedback.upvotes.findIndex(
      id => id.toString() === req.userId
    )
    
    if (upvoteIndex > -1) {
      feedback.upvotes.splice(upvoteIndex, 1)
    } else {
      feedback.upvotes.push(userObjectId)
    }
    
    await feedback.save()
    
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'name')
    
    res.json({
      ...populatedFeedback?.toObject(),
      voteScore: populatedFeedback!.upvotes.length - populatedFeedback!.downvotes.length
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Downvote feedback
router.post('/:id/downvote', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    
    const mongoose = await import('mongoose')
    const userObjectId = new mongoose.Types.ObjectId(req.userId)
    
    // Remove from upvotes if exists
    feedback.upvotes = feedback.upvotes.filter(
      id => id.toString() !== req.userId
    )
    
    // Toggle downvote
    const downvoteIndex = feedback.downvotes.findIndex(
      id => id.toString() === req.userId
    )
    
    if (downvoteIndex > -1) {
      feedback.downvotes.splice(downvoteIndex, 1)
    } else {
      feedback.downvotes.push(userObjectId)
    }
    
    await feedback.save()
    
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('userId', 'name')
    
    res.json({
      ...populatedFeedback?.toObject(),
      voteScore: populatedFeedback!.upvotes.length - populatedFeedback!.downvotes.length
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update feedback status (admin only)
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status, adminResponse } = req.body
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    ).populate('userId', 'name')
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    
    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete feedback (admin or owner)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    
    // Only allow deletion by owner or admin
    if (feedback.userId?.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    
    await Feedback.findByIdAndDelete(req.params.id)
    res.json({ message: 'Feedback deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get feedback statistics
router.get('/stats/summary', async (_req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalUpvotes: { $sum: { $size: '$upvotes' } }
        }
      }
    ])
    
    const totalFeedback = await Feedback.countDocuments()
    const pendingFeedback = await Feedback.countDocuments({ status: 'PENDING' })
    
    res.json({
      stats,
      totalFeedback,
      pendingFeedback
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
