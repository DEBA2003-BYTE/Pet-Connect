import { Router } from 'express'
import Post from '../models/Post.js'
import Follow from '../models/Follow.js'
import User from '../models/User.js'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js'

const router = Router()

// Create a new post
router.post('/posts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content, images, visibility } = req.body

    const post = await Post.create({
      authorId: req.userId,
      content,
      images: images || [],
      visibility: visibility || 'PUBLIC'
    })

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email profilePicture')

    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get feed (posts from followed users + own posts)
router.get('/feed', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    // Get users that current user follows
    const following = await Follow.find({ followerId: req.userId })
    const followingIds = following.map(f => f.followingId)

    // Include own posts and posts from followed users
    const posts = await Post.find({
      $or: [
        { authorId: req.userId },
        { authorId: { $in: followingIds }, visibility: { $in: ['PUBLIC', 'FOLLOWERS'] } },
        { visibility: 'PUBLIC' }
      ]
    })
      .populate('authorId', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.userId', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Post.countDocuments({
      $or: [
        { authorId: req.userId },
        { authorId: { $in: followingIds }, visibility: { $in: ['PUBLIC', 'FOLLOWERS'] } },
        { visibility: 'PUBLIC' }
      ]
    })

    res.json({
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get user's posts
router.get('/posts/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .populate('authorId', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.userId', 'name profilePicture')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Like a post
router.post('/posts/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userIdObj = new (await import('mongoose')).Types.ObjectId(req.userId)
    const likeIndex = post.likes.findIndex(id => id.equals(userIdObj))

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1)
    } else {
      // Like
      post.likes.push(userIdObj)
    }

    await post.save()
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.userId', 'name profilePicture')

    res.json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Comment on a post
router.post('/posts/:id/comment', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { text } = req.body
    
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({
      userId: new (await import('mongoose')).Types.ObjectId(req.userId),
      text,
      createdAt: new Date()
    })

    await post.save()
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.userId', 'name profilePicture')

    res.json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Share a post
router.post('/posts/:id/share', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const userIdObj = new (await import('mongoose')).Types.ObjectId(req.userId)
    
    if (!post.shares.some(id => id.equals(userIdObj))) {
      post.shares.push(userIdObj)
      await post.save()
    }

    res.json({ message: 'Post shared successfully', shares: post.shares.length })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete a post
router.delete('/posts/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update a post
router.patch('/posts/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content, images } = req.body
    
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    post.content = content
    post.images = images
    post.isEdited = true
    await post.save()

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'name email profilePicture')
      .populate('likes', 'name')
      .populate('comments.userId', 'name profilePicture')

    res.json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Follow a user
router.post('/follow/:userId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.userId === req.params.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' })
    }

    const existingFollow = await Follow.findOne({
      followerId: req.userId,
      followingId: req.params.userId
    })

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' })
    }

    await Follow.create({
      followerId: req.userId,
      followingId: req.params.userId
    })

    res.json({ message: 'Successfully followed user' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Unfollow a user
router.delete('/follow/:userId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await Follow.findOneAndDelete({
      followerId: req.userId,
      followingId: req.params.userId
    })

    res.json({ message: 'Successfully unfollowed user' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await Follow.find({ followingId: req.params.userId })
      .populate('followerId', 'name email profilePicture')

    res.json(followers.map(f => f.followerId))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get following
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.params.userId })
      .populate('followingId', 'name email profilePicture')

    res.json(following.map(f => f.followingId))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Check if following
router.get('/following/:userId/check', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const follow = await Follow.findOne({
      followerId: req.userId,
      followingId: req.params.userId
    })

    res.json({ isFollowing: !!follow })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get suggested users to follow
router.get('/suggestions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get users current user is already following
    const following = await Follow.find({ followerId: req.userId })
    const followingIds = following.map(f => f.followingId.toString())

    // Find users not being followed (excluding self)
    const mongoose = await import('mongoose')
    const excludeIds = [...followingIds.map(id => new mongoose.Types.ObjectId(id)), new mongoose.Types.ObjectId(req.userId)]
    
    const suggestions = await User.find({
      _id: { $nin: excludeIds }
    })
      .select('name email profilePicture role')
      .limit(10)

    res.json(suggestions)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
