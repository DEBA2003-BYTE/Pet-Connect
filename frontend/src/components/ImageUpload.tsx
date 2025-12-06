import { useState, useRef } from 'react'
import api from '../services/api'
import './ImageUpload.css'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  folder?: string
  maxFiles?: number
  currentImages?: string[]
}

export default function ImageUpload({ 
  onUploadComplete, 
  folder = 'petconnect',
  maxFiles = 5,
  currentImages = []
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (currentImages.length >= maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    await uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setUploading(true)

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string

        // Upload to backend which will upload to Cloudinary
        const { data } = await api.post('/media/upload', {
          image: base64Image,
          folder
        })

        onUploadComplete(data.url)
        setPreview(null)
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading || currentImages.length >= maxFiles}
        className="file-input"
        id="image-upload-input"
      />
      
      <label htmlFor="image-upload-input" className={`upload-label ${uploading ? 'uploading' : ''}`}>
        {uploading ? (
          <div className="upload-progress">
            <div className="spinner"></div>
            <span>Uploading...</span>
          </div>
        ) : preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📷</span>
            <span>Click to upload image</span>
            <span className="upload-hint">Max {maxFiles} images, up to 5MB each</span>
          </div>
        )}
      </label>

      {currentImages.length > 0 && (
        <div className="upload-info">
          {currentImages.length} / {maxFiles} images uploaded
        </div>
      )}
    </div>
  )
}
