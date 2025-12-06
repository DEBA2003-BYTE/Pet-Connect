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
  salesCount?: number
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
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    ageGroup: '',
    breedSize: '',
    foodType: '',
    material: '',
    sort: 'newest'
  })

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
  }, [category, search, filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: any = { ...filters }
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

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    try {
      const { data } = await api.get(`/store/search/suggestions?q=${query}`)
      setSuggestions(data.map((p: any) => p.name))
    } catch (error) {
      console.error('Failed to fetch suggestions', error)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    fetchSuggestions(value)
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
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => {
                    setSearch(suggestion)
                    setSuggestions([])
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          🔍 Filters & Sort
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="newest">Newly Added</option>
              <option value="trending">🔥 Trending</option>
              <option value="bestseller">Bestselling</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>

          <button 
            className="btn btn-secondary"
            onClick={() => setFilters({
              minPrice: '',
              maxPrice: '',
              brand: '',
              ageGroup: '',
              breedSize: '',
              foodType: '',
              material: '',
              sort: 'newest'
            })}
          >
            Clear Filters
          </button>
        </div>
      )}

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
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('.no-image')) {
                        const placeholder = document.createElement('div')
                        placeholder.className = 'no-image'
                        placeholder.textContent = '📦'
                        parent.appendChild(placeholder)
                      }
                    }}
                  />
                ) : (
                  <div className="no-image">📦</div>
                )}
                {product.salesCount && product.salesCount > 50 && (
                  <span className="trending-badge">
                    🔥 Trending
                  </span>
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
