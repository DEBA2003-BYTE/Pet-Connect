import { Router } from 'express'
import Wishlist from '../models/Wishlist'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

// Get user wishlist
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId }).populate('products')
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.userId, products: [] })
    }

    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Add to wishlist
router.post('/add/:productId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId })
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ 
        userId: req.userId, 
        products: [req.params.productId] 
      })
    } else {
      if (!wishlist.products.includes(req.params.productId as any)) {
        wishlist.products.push(req.params.productId as any)
        await wishlist.save()
      }
    }

    wishlist = await wishlist.populate('products')
    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Remove from wishlist
router.delete('/remove/:productId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId })
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== req.params.productId
    )
    await wishlist.save()
    await wishlist.populate('products')
    
    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
