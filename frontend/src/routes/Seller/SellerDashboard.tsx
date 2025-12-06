import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AddService from './AddService'
import AddProduct from './AddProduct'
import MyListings from './MyListings'
import './SellerDashboard.css'

export default function SellerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'listings'>('listings')

  if (user?.role !== 'SERVICE_PROVIDER') {
    return (
      <div className="seller-dashboard">
        <div className="access-denied">
          <h2>⚠️ Access Denied</h2>
          <p>Only Service Providers can access this page.</p>
          <p>Please contact admin to upgrade your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>🏪 Seller Dashboard</h1>
        <p>Manage your services and products</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          📋 My Listings
        </button>
        <button
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          🏥 Add Service
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛒 Add Product
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'listings' && <MyListings />}
        {activeTab === 'services' && <AddService />}
        {activeTab === 'products' && <AddProduct />}
      </div>
    </div>
  )
}
