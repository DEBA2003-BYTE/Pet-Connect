import { useState, useEffect } from 'react'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'
import './Community.css'

interface User {
  _id: string
  name: string
  email: string
  profilePicture?: string
}

interface Comment {
  _id?: string
  userId: User
  text: string
  createdAt: string
}

interface Post {
  _id: string
  authorId: User
  content: string
  images: string[]
  likes: User[]
  shares: User[]
  comments: Comment[]
  isEdited: boolean
  createdAt: string
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [newPostImages, setNewPostImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({})
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [creatingPost, setCreatingPost] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    fetchFeed()
    fetchSuggestions()
    fetchCurrentUser()
  }, [])

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.share-wrapper')) {
        setShowShareMenu(null)
      }
    }

    if (showShareMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showShareMenu])

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get('/users/me')
      setCurrentUser(data)
    } catch (error) {
      console.error('Failed to fetch current user', error)
    }
  }

  const fetchFeed = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/community/feed')
      setPosts(data.posts)
    } catch (error) {
      console.error('Failed to fetch feed', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get('/community/suggestions')
      setSuggestions(data)
    } catch (error) {
      console.error('Failed to fetch suggestions', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      alert('Please write something before posting!')
      return
    }

    setCreatingPost(true)
    try {
      console.log('Creating post with:', { 
        content: newPost, 
        images: newPostImages,
        imageCount: newPostImages.length 
      })
      
      const { data } = await api.post('/community/posts', {
        content: newPost,
        images: newPostImages
      })
      
      console.log('Post created successfully:', {
        postId: data._id,
        content: data.content,
        images: data.images,
        imageCount: data.images?.length || 0
      })
      setPosts([data, ...posts])
      setNewPost('')
      setNewPostImages([])
      setShowCreatePost(false)
      alert('✅ Post created successfully!')
    } catch (error: any) {
      console.error('Failed to create post:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post'
      alert(`❌ Error: ${errorMessage}\n\nMake sure the backend server is running on port 5001`)
    } finally {
      setCreatingPost(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const { data } = await api.post(`/community/posts/${postId}/like`)
      setPosts(posts.map(p => p._id === postId ? data : p))
    } catch (error) {
      console.error('Failed to like post', error)
    }
  }

  const handleComment = async (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim()) return

    try {
      const { data } = await api.post(`/community/posts/${postId}/comment`, { text })
      setPosts(posts.map(p => p._id === postId ? data : p))
      setCommentText({ ...commentText, [postId]: '' })
    } catch (error) {
      console.error('Failed to comment', error)
    }
  }

  const handleShare = (postId: string, post: Post) => {
    // Toggle share menu
    setShowShareMenu(showShareMenu === postId ? null : postId)
  }

  const shareToSocial = async (postId: string, post: Post, platform: string) => {
    const postUrl = `${window.location.origin}/community/post/${postId}`
    const text = `Check out this post: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`
    
    let shareUrl = ''
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + postUrl)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`
        break
      case 'copy':
        navigator.clipboard.writeText(postUrl)
        alert('✅ Link copied to clipboard!')
        setShowShareMenu(null)
        return
    }
    
    if (shareUrl) {
      // Track share in backend
      try {
        await api.post(`/community/posts/${postId}/share`)
        setPosts(posts.map(p => {
          if (p._id === postId) {
            return { ...p, shares: [...p.shares, currentUser!] }
          }
          return p
        }))
      } catch (error) {
        console.error('Failed to track share', error)
      }
      
      // Open share window
      window.open(shareUrl, '_blank', 'width=600,height=400')
      setShowShareMenu(null)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await api.delete(`/community/posts/${postId}`)
      setPosts(posts.filter(p => p._id !== postId))
      alert('✅ Post deleted successfully!')
    } catch (error: any) {
      console.error('Failed to delete post', error)
      alert(`❌ Failed to delete post: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      await api.post(`/community/follow/${userId}`)
      setFollowing(new Set([...following, userId]))
      fetchSuggestions()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to follow user')
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await api.delete(`/community/follow/${userId}`)
      const newFollowing = new Set(following)
      newFollowing.delete(userId)
      setFollowing(newFollowing)
      fetchSuggestions()
    } catch (error) {
      console.error('Failed to unfollow user', error)
    }
  }

  const isLiked = (post: Post) => {
    return post.likes.some(user => user._id === currentUser?._id)
  }

  const formatTime = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diff = now.getTime() - postDate.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return postDate.toLocaleDateString()
  }

  return (
    <div className="community-container">
      <div className="community-layout">
        {/* Left Sidebar - User Info */}
        <aside className="community-sidebar left">
          <div className="user-card">
            <div className="user-avatar">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt={currentUser.name} />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3>{currentUser?.name}</h3>
            <p className="user-email">{currentUser?.email}</p>
          </div>

          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{posts.filter(p => p.authorId._id === currentUser?._id).length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{following.size}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="community-feed">
          {/* Create Post */}
          <div className="create-post-card">
            <div className="create-post-header">
              <div className="user-avatar small">
                {currentUser?.profilePicture ? (
                  <img src={currentUser.profilePicture} alt={currentUser.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button 
                className="create-post-trigger"
                onClick={() => setShowCreatePost(!showCreatePost)}
              >
                What's on your mind, {currentUser?.name?.split(' ')[0]}?
              </button>
            </div>

            {showCreatePost && (
              <div className="create-post-form">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts with the pet community..."
                  rows={4}
                />
                
                <div className="image-upload-section">
                  <div className="upload-header">
                    <div 
                      className="image-upload-wrapper"
                      onChange={() => {
                        // Detect when file input changes (upload starts)
                        setUploadingImages(true)
                      }}
                    >
                      <ImageUpload
                        onUploadComplete={(url) => {
                          console.log('Image uploaded to Cloudinary:', url)
                          setNewPostImages([...newPostImages, url])
                          setUploadingImages(false)
                        }}
                        maxFiles={5}
                        currentImages={newPostImages}
                      />
                    </div>
                    {uploadingImages && (
                      <span className="image-count uploading">
                        ⏳ Uploading... Please wait
                      </span>
                    )}
                    {!uploadingImages && newPostImages.length > 0 && (
                      <span className="image-count ready">
                        ✅ {newPostImages.length} {newPostImages.length === 1 ? 'image' : 'images'} ready to post
                      </span>
                    )}
                  </div>
                  {newPostImages.length > 0 && (
                    <div className="uploaded-images">
                      {newPostImages.map((img, idx) => (
                        <div key={idx} className="uploaded-image">
                          <img src={img} alt={`Upload ${idx + 1}`} />
                          <button 
                            className="remove-image"
                            onClick={() => {
                              console.log('Removing image:', img)
                              setNewPostImages(newPostImages.filter((_, i) => i !== idx))
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {uploadingImages && (
                  <div className="upload-warning">
                    ⚠️ Please wait for image upload to complete before posting
                  </div>
                )}
                
                <div className="create-post-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowCreatePost(false)
                      setUploadingImages(false)
                    }}
                    disabled={creatingPost}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCreatePost}
                    disabled={creatingPost || !newPost.trim() || uploadingImages}
                    title={uploadingImages ? 'Wait for images to finish uploading' : ''}
                  >
                    {creatingPost ? '⏳ Posting...' : uploadingImages ? '⏳ Uploading...' : '📝 Post'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="loading">Loading feed...</div>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="post-author">
                      <div className="user-avatar small">
                        {post.authorId.profilePicture ? (
                          <img src={post.authorId.profilePicture} alt={post.authorId.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {post.authorId.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="author-info">
                        <h4>{post.authorId.name}</h4>
                        <span className="post-time">
                          {formatTime(post.createdAt)}
                          {post.isEdited && <span className="edited-badge"> • Edited</span>}
                        </span>
                      </div>
                    </div>
                    {post.authorId._id === currentUser?._id && (
                      <button 
                        className="delete-post-btn"
                        onClick={() => handleDeletePost(post._id)}
                        title="Delete post"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className={`post-images grid-${Math.min(post.images.length, 3)}`}>
                      {post.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Post image ${idx + 1}`}
                          onError={(e) => {
                            console.error('Failed to load image:', img)
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="post-stats">
                    <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                    <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                    <span>{post.shares.length} {post.shares.length === 1 ? 'share' : 'shares'}</span>
                  </div>

                  {/* Post Actions */}
                  <div className="post-actions">
                    <button 
                      className={`action-btn ${isLiked(post) ? 'liked' : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                      {isLiked(post) ? '❤️' : '🤍'} Like
                    </button>
                    <button className="action-btn">
                      💬 Comment
                    </button>
                    <div className="share-wrapper">
                      <button 
                        className="action-btn" 
                        onClick={() => handleShare(post._id, post)}
                      >
                        🔄 Share
                      </button>
                      {showShareMenu === post._id && (
                        <div className="share-menu">
                          <button onClick={() => shareToSocial(post._id, post, 'whatsapp')}>
                            <span className="share-icon">💬</span> WhatsApp
                          </button>
                          <button onClick={() => shareToSocial(post._id, post, 'facebook')}>
                            <span className="share-icon">📘</span> Facebook
                          </button>
                          <button onClick={() => shareToSocial(post._id, post, 'twitter')}>
                            <span className="share-icon">🐦</span> Twitter
                          </button>
                          <button onClick={() => shareToSocial(post._id, post, 'telegram')}>
                            <span className="share-icon">✈️</span> Telegram
                          </button>
                          <button onClick={() => shareToSocial(post._id, post, 'copy')}>
                            <span className="share-icon">🔗</span> Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="comments-section">
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="comment">
                        <div className="user-avatar tiny">
                          {comment.userId.profilePicture ? (
                            <img src={comment.userId.profilePicture} alt={comment.userId.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {comment.userId.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="comment-content">
                          <div className="comment-bubble">
                            <strong>{comment.userId.name}</strong>
                            <p>{comment.text}</p>
                          </div>
                          <span className="comment-time">{formatTime(comment.createdAt)}</span>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="add-comment">
                      <div className="user-avatar tiny">
                        {currentUser?.profilePicture ? (
                          <img src={currentUser.profilePicture} alt={currentUser.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                      />
                      <button onClick={() => handleComment(post._id)}>➤</button>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="no-posts">
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar - Suggestions */}
        <aside className="community-sidebar right">
          <div className="suggestions-card">
            <h3>Suggested for you</h3>
            <div className="suggestions-list">
              {suggestions.map(user => (
                <div key={user._id} className="suggestion-item">
                  <div className="user-avatar tiny">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="suggestion-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  <button 
                    className="btn-follow"
                    onClick={() => handleFollow(user._id)}
                  >
                    Follow
                  </button>
                </div>
              ))}

              {suggestions.length === 0 && (
                <p className="no-suggestions">No suggestions available</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
