import { useState, useEffect } from 'react'
import api from '../../services/api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  phone?: string
  isVerified: boolean
  isBlocked?: boolean
  createdAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  const roles = ['ALL', 'PET_OWNER', 'SERVICE_PROVIDER', 'NGO', 'VET', 'VOLUNTEER', 'ADMIN']

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter !== 'ALL') params.role = filter

      const { data } = await api.get('/admin/users', { params })
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return

    try {
      await api.patch(`/admin/users/${userId}/block`, { isBlocked: !currentStatus })
      alert(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully!`)
      fetchUsers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('⚠️ Are you sure you want to DELETE this user? This action cannot be undone!')) return
    
    const confirmText = prompt('Type "DELETE" to confirm:')
    if (confirmText !== 'DELETE') {
      alert('Deletion cancelled')
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      alert('User deleted successfully!')
      fetchUsers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`)
      alert('User verified successfully!')
      fetchUsers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to verify user')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loading">Loading users...</div>

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <div className="user-stats">
          <div className="stat-card">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{users.filter(u => u.isBlocked).length}</span>
            <span className="stat-label">Blocked</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{users.filter(u => u.isVerified).length}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
      </div>

      <div className="management-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="role-filters">
          {roles.map(role => (
            <button
              key={role}
              className={`filter-btn ${filter === role ? 'active' : ''}`}
              onClick={() => setFilter(role)}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className={user.isBlocked ? 'blocked-user' : ''}>
                <td>
                  <div className="user-name">
                    {user.name}
                    {user.isVerified && <span className="verified-icon">✓</span>}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td>{user.phone || '-'}</td>
                <td>
                  {user.isBlocked ? (
                    <span className="status-badge blocked">🚫 Blocked</span>
                  ) : (
                    <span className="status-badge active">✓ Active</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {!user.isVerified && (
                      <button
                        className="btn-action btn-verify"
                        onClick={() => handleVerifyUser(user._id)}
                        title="Verify User"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className={`btn-action ${user.isBlocked ? 'btn-unblock' : 'btn-block'}`}
                      onClick={() => handleBlockUser(user._id, user.isBlocked || false)}
                      title={user.isBlocked ? 'Unblock' : 'Block'}
                    >
                      {user.isBlocked ? '🔓' : '🔒'}
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-data">No users found</div>
        )}
      </div>
    </div>
  )
}
