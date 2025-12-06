import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import './ProductDetail.css'

interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  specifications: {
    brand?: string
    weight?: string
    size?: string
    material?: string
    ageGroup?: string
    petType?: string[]
    ingredients?: string
    usageInstructions?: string
  }
  ratings: {
    average: number
    count: number
  }
  reviews: Array<{
    _id: string
    userId: { name: string }
    rating: number
    comment: string
    images?: string[]
    isVerifiedPurchase: boolean
    createdAt: string
  }>
  subscriptionAvailable: boolean
  subscriptionDiscount?: number
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    images: [] as string[]
  })
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchSuggestions()
    checkWishlist()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/store/products/${id}`)
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get(`/store/products/${id}/suggestions`)
      setSuggestions(data)
    } catch (error) {
      console.error('Failed to fetch suggestions', error)
    }
  }

  const checkWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist')
      setIsInWishlist(data.products.some((p: any) => p._id === id))
    } catch (error) {
      console.error('Failed to check wishlist', error)
    }
  }

  const handleAddToCart = async () => {
    try {
      await api.post('/store/cart/add', { productId: id, quantity })
      alert('Added to cart!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    navigate('/store/cart')
  }

  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${id}`)
        setIsInWishlist(false)
      } else {
        await api.post(`/wishlist/add/${id}`)
        setIsInWishlist(true)
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update wishlist')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post(`/store/products/${id}/reviews`, reviewData)
      alert('Review submitted!')
      setShowReviewForm(false)
      setReviewData({ rating: 5, comment: '', images: [] })
      fetchProduct()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!product) return <div className="error">Product not found</div>

  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div className="product-detail-container">
      <div className="product-detail-main">
        <div className="product-images">
          <div className="main-image">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="40" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E📦%3C/text%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="no-image" style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', fontSize: '60px' }}>📦</div>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <div className="low-stock-alert">⚠️ Only {product.stock} left!</div>
            )}
          </div>
          <div className="image-thumbnails">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={selectedImage === idx ? 'active' : ''}
                onClick={() => setSelectedImage(idx)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E📦%3C/text%3E%3C/svg%3E'
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          
          {product.specifications.brand && (
            <p className="brand">Brand: {product.specifications.brand}</p>
          )}

          <div className="rating-section">
            <span className="stars">⭐ {product.ratings.average.toFixed(1)}</span>
            <span className="rating-count">({product.ratings.count} ratings)</span>
          </div>

          <div className="pricing-section">
            {product.discountPrice ? (
              <>
                <span className="current-price">₹{product.discountPrice}</span>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-badge">{discount}% OFF</span>
              </>
            ) : (
              <span className="current-price">₹{product.price}</span>
            )}
          </div>

          {product.subscriptionAvailable && (
            <div className="subscription-offer">
              🔄 Subscribe & Save {product.subscriptionDiscount || 10}%
              <p>Deliver every 30 days</p>
            </div>
          )}

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              ⚡ Buy Now
            </button>
            <button 
              className={`btn btn-wishlist ${isInWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.specifications.ingredients && (
            <div className="product-specs">
              <h3>Ingredients</h3>
              <p>{product.specifications.ingredients}</p>
            </div>
          )}

          {product.specifications.usageInstructions && (
            <div className="product-specs">
              <h3>Usage Instructions</h3>
              <p>{product.specifications.usageInstructions}</p>
            </div>
          )}

          <div className="product-specs">
            <h3>Specifications</h3>
            <ul>
              {product.specifications.weight && <li><strong>Weight:</strong> {product.specifications.weight}</li>}
              {product.specifications.size && <li><strong>Size:</strong> {product.specifications.size}</li>}
              {product.specifications.material && <li><strong>Material:</strong> {product.specifications.material}</li>}
              {product.specifications.ageGroup && <li><strong>Age Group:</strong> {product.specifications.ageGroup}</li>}
              {product.specifications.petType && <li><strong>Pet Type:</strong> {product.specifications.petType.join(', ')}</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Ratings & Reviews</h2>
          <button className="btn btn-primary" onClick={() => setShowReviewForm(!showReviewForm)}>
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={star <= reviewData.rating ? 'star active' : 'star'}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Share your experience..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Add Photos (Optional)</label>
              <ImageUpload
                onUploadComplete={(url) => {
                  setReviewData({ ...reviewData, images: [...reviewData.images, url] })
                }}
                folder="product-reviews"
                maxFiles={3}
                currentImages={reviewData.images}
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}

        <div className="reviews-list">
          {product.reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div>
                  <strong>{review.userId.name}</strong>
                  {review.isVerifiedPurchase && (
                    <span className="verified-badge">✓ Verified Purchase</span>
                  )}
                </div>
                <div className="review-rating">
                  {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                  ))}
                </div>
              )}
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <h2>You May Also Like</h2>
          <div className="suggestions-grid">
            {suggestions.map(item => (
              <div key={item._id} className="suggestion-card" onClick={() => navigate(`/store/product/${item._id}`)}>
                <img src={item.images[0]} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="suggestion-price">
                  <span>₹{item.discountPrice || item.price}</span>
                  <span className="suggestion-rating">⭐ {item.ratings.average.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
