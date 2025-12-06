import { Router } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

const router = Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Get upload signature for client-side uploads
router.get('/signature', authMiddleware, (req: AuthRequest, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = req.query.folder || 'petconnect'
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate signature', error })
  }
})

// Server-side upload (alternative method)
router.post('/upload', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { image, folder = 'petconnect' } = req.body

    if (!image) {
      return res.status(400).json({ message: 'No image provided' })
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto'
    })

    res.json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error })
  }
})

// Delete image
router.delete('/delete/:publicId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, '/')
    
    await cloudinary.uploader.destroy(publicId)
    
    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error })
  }
})

export default router
