import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import UserManagement from './UserManagement'
import ContentModeration from './ContentModeration'
import AccessLogs from './AccessLogs'
import SystemStats from './SystemStats'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'logs' | 'stats'>('stats')

  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>🚫 Access Denied</h2>
          <p>Only Administrators can access this page.</p>
          <p>Contact the system administrator if you believe this is an error.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>System Administration & Moderation</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📝 Content Moderation
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Access Logs
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && <SystemStats />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'content' && <ContentModeration />}
        {activeTab === 'logs' && <AccessLogs />}
      </div>
    </div>
  )
}
