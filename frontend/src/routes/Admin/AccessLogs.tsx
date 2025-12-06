import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Log {
  _id: string
  userId?: {
    name: string
    email: string
    role: string
  }
  action: string
  resource: string
  method: string
  statusCode: number
  ipAddress: string
  userAgent: string
  timestamp: string
}

export default function AccessLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [filter, page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params: any = { page, limit: 50 }
      if (filter !== 'ALL') params.method = filter

      const { data } = await api.get('/admin/logs', { params })
      setLogs(data.logs)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('Failed to fetch logs', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'success'
    if (code >= 400 && code < 500) return 'warning'
    if (code >= 500) return 'error'
    return 'info'
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'get'
      case 'POST': return 'post'
      case 'PUT':
      case 'PATCH': return 'put'
      case 'DELETE': return 'delete'
      default: return 'default'
    }
  }

  if (loading) return <div className="loading">Loading logs...</div>

  return (
    <div className="access-logs">
      <div className="management-header">
        <h2>Access Logs</h2>
        <div className="log-stats">
          <div className="stat-card">
            <span className="stat-value">{logs.length}</span>
            <span className="stat-label">Recent Logs</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{logs.filter(l => l.statusCode >= 400).length}</span>
            <span className="stat-label">Errors</span>
          </div>
        </div>
      </div>

      <div className="management-filters">
        <div className="method-filters">
          {['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(method => (
            <button
              key={method}
              className={`filter-btn ${filter === method ? 'active' : ''}`}
              onClick={() => setFilter(method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Method</th>
              <th>Resource</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>
                  {log.userId ? (
                    <div className="user-info">
                      <div>{log.userId.name}</div>
                      <div className="user-email">{log.userId.email}</div>
                      <span className={`role-badge role-${log.userId.role.toLowerCase()}`}>
                        {log.userId.role}
                      </span>
                    </div>
                  ) : (
                    <span className="anonymous">Anonymous</span>
                  )}
                </td>
                <td>
                  <span className={`method-badge method-${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                </td>
                <td className="resource">{log.resource}</td>
                <td>
                  <span className={`status-badge status-${getStatusColor(log.statusCode)}`}>
                    {log.statusCode}
                  </span>
                </td>
                <td className="ip-address">{log.ipAddress}</td>
                <td className="user-agent">{log.userAgent.substring(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="no-data">No logs found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
