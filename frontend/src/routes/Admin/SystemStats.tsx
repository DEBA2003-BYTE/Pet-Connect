import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Stats {
  users: {
    total: number
    byRole: Record<string, number>
    active: number
    blocked: number
  }
  content: {
    products: number
    services: number
    rescues: number
    adoptions: number
    lostFound: number
  }
  activity: {
    todayLogins: number
    todaySignups: number
    todayPosts: number
  }
}

export default function SystemStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading statistics...</div>
  if (!stats) return <div className="error">Failed to load statistics</div>

  return (
    <div className="system-stats">
      <h2>System Overview</h2>

      <div className="stats-grid">
        <div className="stat-section">
          <h3>👥 Users</h3>
          <div className="stat-cards">
            <div className="stat-card large">
              <span className="stat-value">{stats.users.total}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.users.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.users.blocked}</span>
              <span className="stat-label">Blocked</span>
            </div>
          </div>

          <div className="role-breakdown">
            <h4>By Role</h4>
            {Object.entries(stats.users.byRole).map(([role, count]) => (
              <div key={role} className="role-stat">
                <span className="role-name">{role.replace('_', ' ')}</span>
                <span className="role-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-section">
          <h3>📝 Content</h3>
          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-value">{stats.content.products}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.content.services}</span>
              <span className="stat-label">Services</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.content.rescues}</span>
              <span className="stat-label">Rescues</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.content.adoptions}</span>
              <span className="stat-label">Adoptions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.content.lostFound}</span>
              <span className="stat-label">Lost & Found</span>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h3>📊 Today's Activity</h3>
          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-value">{stats.activity.todayLogins}</span>
              <span className="stat-label">Logins</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.activity.todaySignups}</span>
              <span className="stat-label">New Signups</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.activity.todayPosts}</span>
              <span className="stat-label">New Posts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => window.location.href = '/admin?tab=users'}>
            Manage Users
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/admin?tab=content'}>
            Moderate Content
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/admin?tab=logs'}>
            View Logs
          </button>
          <button className="btn btn-secondary" onClick={fetchStats}>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  )
}
