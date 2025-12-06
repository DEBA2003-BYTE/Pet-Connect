import { Router } from 'express'
import User from '../models/User'
import Product from '../models/Product'
import ServiceLocation from '../models/ServiceLocation'
import RescueReport from '../models/RescueReport'
import AdoptionListing from '../models/AdoptionListing'
import LostFound from '../models/LostFound'
import AccessLog from '../models/AccessLog'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

// Middleware to check if user is admin
const adminOnly = async (req: AuthRequest, res: any, next: any) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin only.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Get all users
router.get('/users', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { role } = req.query
    const query: any = {}
    if (role) query.role = role

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Block/Unblock user
router.patch('/users/:id/block', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { isBlocked } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Log action
    await AccessLog.create({
      userId: req.userId,
      action: isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
      resource: `/admin/users/${req.params.id}/block`,
      method: 'PATCH',
      statusCode: 200,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete user
router.delete('/users/:id', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Log action
    await AccessLog.create({
      userId: req.userId,
      action: 'DELETE_USER',
      resource: `/admin/users/${req.params.id}`,
      method: 'DELETE',
      statusCode: 200,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Verify user
router.patch('/users/:id/verify', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get all content (products, services, etc.)
router.get('/content', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { type } = req.query
    let content: any[] = []

    if (!type || type === 'product') {
      const products = await Product.find().populate('sellerId', 'name email').sort({ createdAt: -1 })
      content = [...content, ...products.map(p => ({
        _id: p._id,
        type: 'product',
        title: p.name,
        description: p.description,
        createdBy: p.sellerId,
        isActive: p.isActive,
        createdAt: p.createdAt
      }))]
    }

    if (!type || type === 'service') {
      const services = await ServiceLocation.find().populate('verifiedBy', 'name email').sort({ createdAt: -1 })
      content = [...content, ...services.map((s: any) => ({
        _id: s._id,
        type: 'service',
        title: s.name,
        description: s.address || s.type,
        createdBy: s.verifiedBy,
        isActive: true,
        createdAt: s.createdAt
      }))]
    }

    res.json(content)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update content status
router.patch('/content/:type/:id', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { type, id } = req.params
    const { isActive } = req.body

    let updated
    switch (type) {
      case 'product':
        updated = await Product.findByIdAndUpdate(id, { isActive }, { new: true })
        break
      default:
        return res.status(400).json({ message: 'Invalid content type' })
    }

    if (!updated) {
      return res.status(404).json({ message: 'Content not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Delete content
router.delete('/content/:type/:id', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { type, id } = req.params

    let deleted
    switch (type) {
      case 'product':
        deleted = await Product.findByIdAndDelete(id)
        break
      case 'service':
        deleted = await ServiceLocation.findByIdAndDelete(id)
        break
      case 'rescue':
        deleted = await RescueReport.findByIdAndDelete(id)
        break
      case 'adoption':
        deleted = await AdoptionListing.findByIdAndDelete(id)
        break
      case 'lostfound':
        deleted = await LostFound.findByIdAndDelete(id)
        break
      default:
        return res.status(400).json({ message: 'Invalid content type' })
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Content not found' })
    }

    res.json({ message: 'Content deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get access logs
router.get('/logs', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { method, page = 1, limit = 50 } = req.query
    const query: any = {}
    if (method) query.method = method

    const logs = await AccessLog.find(query)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await AccessLog.countDocuments(query)

    res.json({
      logs,
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

// Update product images (utility endpoint)
router.post('/update-product-images', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const imageUpdates: Record<string, string[]> = {
      'Drools Chicken & Rice Adult Dog Food': [
        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop'
      ],
      'Whiskas Ocean Fish Kitten Food (Dry)': [
        'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591768575557-5973a0e90f8f?w=500&auto=format&fit=crop'
      ],
      'Vitapol Complete Rabbit Pellets': [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&auto=format&fit=crop'
      ],
      'Kong Classic Chew Toy (Dog)': [
        'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591856378301-5c3a7f2e4c8f?w=500&auto=format&fit=crop'
      ],
      'Catnip Mouse Toy': [
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop'
      ],
      'Rope Tug Toy': [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop'
      ],
      'Adjustable Nylon Dog Harness': [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop'
      ],
      'Reflective Leash (1.5m)': [
        'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=500&auto=format&fit=crop'
      ],
      'Soft Plush Pet Bed (Medium)': [
        'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop'
      ],
      'Himalaya Gentle Puppy Shampoo': [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop'
      ],
      'Steel Grooming Brush': [
        'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=500&auto=format&fit=crop'
      ],
      'Nail Clipper with Safety Guard': [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop'
      ],
      'Calcium Tablets for Dogs': [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop'
      ],
      'Flea & Tick Control Drops': [
        'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop'
      ],
      'Probiotic Digestive Syrup': [
        'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop'
      ],
      'Training Treats (Chicken Bites)': [
        'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop'
      ],
      'Potty Training Bell': [
        'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=500&auto=format&fit=crop'
      ],
      'Dog Training Guidebook': [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop'
      ]
    }

    const results = []
    for (const [productName, images] of Object.entries(imageUpdates)) {
      const result = await Product.updateOne(
        { name: productName },
        { $set: { images } }
      )
      
      results.push({
        product: productName,
        updated: result.modifiedCount > 0
      })
    }

    res.json({
      message: 'Product images update completed',
      results
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get system statistics
router.get('/stats', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      usersByRole,
      totalProducts,
      totalServices,
      totalRescues,
      totalAdoptions,
      totalLostFound,
      todaySignups,
      todayLogs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: { $ne: true } }),
      User.countDocuments({ isBlocked: true }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      Product.countDocuments(),
      ServiceLocation.countDocuments(),
      RescueReport.countDocuments(),
      AdoptionListing.countDocuments(),
      LostFound.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      AccessLog.countDocuments({ timestamp: { $gte: today } })
    ])

    const roleStats: Record<string, number> = {}
    usersByRole.forEach((r: any) => {
      roleStats[r._id] = r.count
    })

    res.json({
      users: {
        total: totalUsers,
        byRole: roleStats,
        active: activeUsers,
        blocked: blockedUsers
      },
      content: {
        products: totalProducts,
        services: totalServices,
        rescues: totalRescues,
        adoptions: totalAdoptions,
        lostFound: totalLostFound
      },
      activity: {
        todayLogins: todayLogs,
        todaySignups,
        todayPosts: 0 // Can be calculated from today's content creation
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
