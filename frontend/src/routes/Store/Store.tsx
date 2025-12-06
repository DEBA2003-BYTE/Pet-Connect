import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import './Store.css'

interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  ratings: {
    average: number
    count: number
  }
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'ALL', label: 'All Products', icon: '🛍️' },
    { value: 'FOOD', label: 'Pet Food', icon: '🍖' },
    { value: 'TOYS', label: 'Toys', icon: '🎾' },
    { value: 'ACCESSORIES', label: 'Accessories', icon: '🎀' },
    { value: 'GROOMING', label: 'Grooming', icon: '✂️' },
    { value: 'HEALTH', label: 'Health & Wellness', icon: '💊' },
    { value: 'TRAINING', label: 'Training', icon: '🎓' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [category, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (category !== 'ALL') params.category = category
      if (search) params.search = search

      const { data } = await api.get('/store/products', { params })
      setProducts(data.products)
    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      setLoading(false)
    }
  }

  const getDiscount = (price: number, discountPrice?: number) => {
    if (!discountPrice) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>🛒 Pet Store</h1>
        <p>Everything your pet needs, delivered to your door</p>
      </div>

      <div className="store-search">
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`category-btn ${category === cat.value ? 'active' : ''}`}
            onClick={() => setCategory(cat.value)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <Link key={product._id} to={`/store/product/${product._id}`} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="no-image">📦</div>
                )}
                {product.discountPrice && (
                  <span className="discount-badge">
                    {getDiscount(product.price, product.discountPrice)}% OFF
                  </span>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description.substring(0, 80)}...</p>
                
                <div className="product-rating">
                  <span className="stars">⭐ {product.ratings.average.toFixed(1)}</span>
                  <span className="rating-count">({product.ratings.count})</span>
                </div>

                <div className="product-pricing">
                  {product.discountPrice ? (
                    <>
                      <span className="discount-price">₹{product.discountPrice}</span>
                      <span className="original-price">₹{product.price}</span>
                    </>
                  ) : (
                    <span className="discount-price">₹{product.price}</span>
                  )}
                </div>

                {product.stock > 0 ? (
                  <span className="stock-status in-stock">In Stock</span>
                ) : (
                  <span className="stock-status out-of-stock">Out of Stock</span>
                )}
              </div>
            </Link>
          ))}

          {products.length === 0 && (
            <div className="no-products">
              <p>No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
