import { useState, useEffect } from 'react'
import api from '../../services/api'
import './Feedback.css'

interface User {
  _id: string
  name: string
}

interface Feedback {
  _id: string
  userId?: User
  category: string
  title: string
  content: string
  rating?: number
  isAnonymous: boolean
  upvotes: string[]
  downvotes: string[]
  voteScore: number
  status: string
  adminResponse?: string
  createdAt: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const [formData, setFormData] = useState({
    category: 'GENERAL',
    title: '',
    content: '',
    rating: 5,
    isAnonymous: false
  })

  const categories = [
    { value: 'RESCUE_MAP', label: 'Rescue Map', icon: '🚨' },
    { value: 'SERVICES', label: 'Services', icon: '🏥' },
    { value: 'LOST_FOUND', label: 'Lost & Found', icon: '🔍' },
    { value: 'ADOPTIONS', label: 'Adoptions', icon: '🏠' },
    { value: 'PET_STORE', label: 'Pet Store', icon: '🛒' },
    { value: 'COMMUNITY', label: 'Community', icon: '👥' },
    { value: 'EVENTS', label: 'Events', icon: '🎉' },
    { value: 'PROFILE', label: 'Profile', icon: '👤' },
    { value: 'GENERAL', label: 'General', icon: '💬' }
  ]

  useEffect(() => {
    fetchFeedbacks()
    fetchCurrentUser()
  }, [filterCategory, sortBy])

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get('/users/me')
      setCurrentUserId(data._id)
    } catch (error) {
      console.error('Failed to fetch current user', error)
    }
  }

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filterCategory !== 'all') params.category = filterCategory
      if (sortBy === 'upvotes') params.sort = 'upvotes'
      if (sortBy === 'rating') params.sort = 'rating'

      const { data } = await api.get('/feedback', { params })
      setFeedbacks(data)
    } catch (error) {
      console.error('Failed to fetch feedbacks', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.post('/feedback', formData)
      alert('✅ Feedback submitted successfully!')
      setShowCreateForm(false)
      resetForm()
      fetchFeedbacks()
    } catch (error: any) {
      alert(`❌ Failed to submit feedback: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleUpvote = async (feedbackId: string) => {
    try {
      const { data } = await api.post(`/feedback/${feedbackId}/upvote`)
      setFeedbacks(feedbacks.map(fb => fb._id === feedbackId ? data : fb))
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || 'Failed to upvote'}`)
    }
  }

  const handleDownvote = async (feedbackId: string) => {
    try {
      const { data } = await api.post(`/feedback/${feedbackId}/downvote`)
      setFeedbacks(feedbacks.map(fb => fb._id === feedbackId ? data : fb))
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || 'Failed to downvote'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      category: 'GENERAL',
      title: '',
      content: '',
      rating: 5,
      isAnonymous: false
    })
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const hasUserVoted = (feedback: Feedback, type: 'up' | 'down') => {
    if (type === 'up') {
      return feedback.upvotes.includes(currentUserId)
    }
    return feedback.downvotes.includes(currentUserId)
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <div>
          <h1>💬 Feedback & Reviews</h1>
          <p className="subtitle">Share your thoughts and help us improve PetConnect</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Submit Feedback'}
        </button>
      </div>

      {/* Create Feedback Form */}
      {showCreateForm && (
        <div className="create-feedback-card">
          <h2>Submit Your Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            <div className="form-group">
              <label>Feedback *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your detailed feedback, suggestions, or concerns..."
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                />
                <span>Submit anonymously</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Submit Feedback
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="feedback-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="loading">Loading feedbacks...</div>
      ) : (
        <div className="feedbacks-list">
          {feedbacks.map(feedback => {
            const categoryInfo = getCategoryInfo(feedback.category)
            return (
              <div key={feedback._id} className="feedback-card">
                <div className="feedback-header-row">
                  <div className="feedback-meta">
                    <span 
                      className="category-badge"
                      style={{ 
                        background: `linear-gradient(135deg, ${getCategoryColor(feedback.category)} 0%, ${getCategoryColor(feedback.category)}dd 100%)`
                      }}
                    >
                      {categoryInfo?.icon} {categoryInfo?.label}
                    </span>
                    <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
                  </div>
                  {feedback.rating && (
                    <div className="feedback-rating">
                      {'⭐'.repeat(feedback.rating)}
                    </div>
                  )}
                </div>

                <h3 className="feedback-title">{feedback.title}</h3>
                <p className="feedback-content">{feedback.content}</p>

                <div className="feedback-footer">
                  <div className="feedback-author">
                    {feedback.isAnonymous ? (
                      <span className="anonymous">👤 Anonymous</span>
                    ) : (
                      <span className="author-name">👤 {feedback.userId?.name || 'User'}</span>
                    )}
                  </div>

                  <div className="feedback-actions">
                    <button 
                      className={`vote-btn upvote ${hasUserVoted(feedback, 'up') ? 'active' : ''}`}
                      onClick={() => handleUpvote(feedback._id)}
                    >
                      👍 {feedback.upvotes.length}
                    </button>
                    <button 
                      className={`vote-btn downvote ${hasUserVoted(feedback, 'down') ? 'active' : ''}`}
                      onClick={() => handleDownvote(feedback._id)}
                    >
                      👎 {feedback.downvotes.length}
                    </button>
                    <span className="vote-score">
                      Score: {feedback.voteScore > 0 ? '+' : ''}{feedback.voteScore}
                    </span>
                  </div>
                </div>

                {feedback.adminResponse && (
                  <div className="admin-response">
                    <div className="admin-badge">🛡️ Admin Response</div>
                    <p>{feedback.adminResponse}</p>
                  </div>
                )}

                <div className={`status-badge status-${feedback.status.toLowerCase()}`}>
                  {feedback.status}
                </div>
              </div>
            )
          })}

          {feedbacks.length === 0 && (
            <div className="no-feedbacks">
              <p>No feedback yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    RESCUE_MAP: '#ef4444',
    SERVICES: '#3b82f6',
    LOST_FOUND: '#f59e0b',
    ADOPTIONS: '#10b981',
    PET_STORE: '#8b5cf6',
    COMMUNITY: '#ec4899',
    EVENTS: '#f59e0b',
    PROFILE: '#6366f1',
    GENERAL: '#6b7280'
  }
  return colors[category] || '#6b7280'
}
