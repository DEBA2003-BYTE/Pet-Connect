import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Content {
  _id: string
  type: 'product' | 'service' | 'rescue' | 'adoption' | 'lostfound'
  title: string
  description: string
  createdBy: {
    name: string
    email: string
  }
  isActive: boolean
  createdAt: string
}

export default function ContentModeration() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  const contentTypes = ['ALL', 'product', 'service', 'rescue', 'adoption', 'lostfound']

  useEffect(() => {
    fetchContent()
  }, [filter])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter !== 'ALL') params.type = filter

      const { data } = await api.get('/admin/content', { params })
      setContents(data)
    } catch (error) {
      console.error('Failed to fetch content', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (contentId: string, type: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/content/${type}/${contentId}`, { isActive: !currentStatus })
      alert(`Content ${currentStatus ? 'deactivated' : 'activated'} successfully!`)
      fetchContent()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update content')
    }
  }

  const handleDeleteContent = async (contentId: string, type: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      await api.delete(`/admin/content/${type}/${contentId}`)
      alert('Content deleted successfully!')
      fetchContent()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete content')
    }
  }

  if (loading) return <div className="loading">Loading content...</div>

  return (
    <div className="content-moderation">
      <div className="management-header">
        <h2>Content Moderation</h2>
        <div className="content-stats">
          <div className="stat-card">
            <span className="stat-value">{contents.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{contents.filter(c => c.isActive).length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{contents.filter(c => !c.isActive).length}</span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>
      </div>

      <div className="management-filters">
        <div className="type-filters">
          {contentTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="content-grid">
        {contents.map(content => (
          <div key={content._id} className={`content-card ${!content.isActive ? 'inactive' : ''}`}>
            <div className="content-header">
              <span className={`type-badge type-${content.type}`}>
                {content.type.toUpperCase()}
              </span>
              <span className={`status-badge ${content.isActive ? 'active' : 'inactive'}`}>
                {content.isActive ? '✓ Active' : '✕ Inactive'}
              </span>
            </div>

            <h3>{content.title}</h3>
            <p className="content-description">{content.description.substring(0, 100)}...</p>

            <div className="content-meta">
              <span>👤 {content.createdBy.name}</span>
              <span>📧 {content.createdBy.email}</span>
              <span>📅 {new Date(content.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="content-actions">
              <button
                className={`btn ${content.isActive ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleToggleStatus(content._id, content.type, content.isActive)}
              >
                {content.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteContent(content._id, content.type)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {contents.length === 0 && (
          <div className="no-data">No content found</div>
        )}
      </div>
    </div>
  )
}
