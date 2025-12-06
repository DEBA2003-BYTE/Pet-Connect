import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container">
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>🚨 Active Rescues</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
        <div className="card">
          <h3>🏥 Nearby Services</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
        <div className="card">
          <h3>🐾 Lost Pets</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
        <div className="card">
          <h3>❤️ Adoptions</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
        </div>
      </div>
    </div>
  )
}
