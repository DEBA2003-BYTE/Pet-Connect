import { Router } from 'express'
import Product from '../models/Product'
import Cart from '../models/Cart'
import Order from '../models/Order'
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

// Get all products with filters
router.get('/products', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query

    const query: any = { isActive: true }

    if (category) query.category = category
    if (search) query.$text = { $search: search as string }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(query)
      .sort(sort as string)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('sellerId', 'name')

    const total = await Product.countDocuments(query)

    res.json({
      products,
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

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name phone email')
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Create product (sellers only)
router.post('/products', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      sellerId: req.userId
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get cart
router.get('/cart', authMiddleware, async (req: AuthRequest, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId')
    
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] })
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Add to cart
router.post('/cart/add', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    let cart = await Cart.findOne({ userId: req.userId })
    
    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [{ productId, quantity, price: product.discountPrice || product.price }]
      })
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ productId, quantity, price: product.discountPrice || product.price })
      }
      
      await cart.save()
    }

    cart = await cart.populate('items.productId')
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Update cart item
router.put('/cart/:productId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { quantity } = req.body
    
    const cart = await Cart.findOne({ userId: req.userId })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(item => item.productId.toString() === req.params.productId)
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' })
    }

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId)
    } else {
      item.quantity = quantity
    }

    await cart.save()
    await cart.populate('items.productId')
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Remove from cart
router.delete('/cart/:productId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId)
    await cart.save()
    await cart.populate('items.productId')
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Create order
router.post('/orders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    const orderNumber = 'ORD' + Date.now()
    
    const order = await Order.create({
      userId: req.userId,
      orderNumber,
      items,
      totalAmount: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID'
    })

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: [] }
    )

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      })
    }

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get user orders
router.get('/orders', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// Get single order
router.get('/orders/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId })
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
