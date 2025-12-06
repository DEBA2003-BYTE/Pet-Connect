import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  isActive: boolean
}

interface Service {
  _id: string
  name: string
  type: string
  address: string
  phone: string
  isVerified: boolean
}

export default function MyListings() {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'products' | 'services'>('products')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      // Fetch seller's products
      const { data: productsData } = await api.get('/store/my-products')
      setProducts(productsData || [])

      // Fetch seller's services
      const { data: servicesData } = await api.get('/services/my-services')
      setServices(servicesData || [])
    } catch (error: any) {
      console.error('Failed to fetch listings', error)
      console.error('Error details:', error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/store/products/${productId}`, { isActive: !currentStatus })
      alert('Product status updated!')
      fetchListings()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await api.delete(`/store/products/${productId}`)
      alert('Product deleted!')
      fetchListings()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await api.delete(`/services/${serviceId}`)
      alert('Service deleted!')
      fetchListings()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete service')
    }
  }

  if (loading) {
    return <div className="loading">Loading your listings...</div>
  }

  return (
    <div className="my-listings">
      <div className="listings-header">
        <h2>My Listings</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
          >
            🛒 Products ({products.length})
          </button>
          <button
            className={`toggle-btn ${activeView === 'services' ? 'active' : ''}`}
            onClick={() => setActiveView('services')}
          >
            🏥 Services ({services.length})
          </button>
        </div>
      </div>

      {activeView === 'products' ? (
        <div className="products-list">
          {products.length === 0 ? (
            <div className="empty-state">
              <p>You haven't added any products yet.</p>
              <p>Click "Add Product" tab to get started!</p>
            </div>
          ) : (
            <div className="listings-grid">
              {products.map(product => (
                <div key={product._id} className="listing-card">
                  <div className="listing-image">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                  
                  <div className="listing-info">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <div className="pricing">
                      {product.discountPrice ? (
                        <>
                          <span className="price">₹{product.discountPrice}</span>
                          <span className="original-price">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="price">₹{product.price}</span>
                      )}
                    </div>
                    <p className="stock">Stock: {product.stock} units</p>
                  </div>

                  <div className="listing-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleProductStatus(product._id, product.isActive)}
                    >
                      {product.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="services-list">
          {services.length === 0 ? (
            <div className="empty-state">
              <p>You haven't added any services yet.</p>
              <p>Click "Add Service" tab to get started!</p>
            </div>
          ) : (
            <div className="listings-grid">
              {services.map(service => (
                <div key={service._id} className="listing-card">
                  <div className="listing-info">
                    <h3>{service.name}</h3>
                    <p className="category">{service.type.replace('_', ' ')}</p>
                    <p className="address">📍 {service.address}</p>
                    <p className="phone">📞 {service.phone}</p>
                    {service.isVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>

                  <div className="listing-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
