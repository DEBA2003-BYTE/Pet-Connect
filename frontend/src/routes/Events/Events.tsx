export default function Events() {
  return (
    <div className="container">
      <h1>Events & Activities</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Sample Event</h3>
          <p>Type: Vaccination Drive</p>
          <p>Date: Coming Soon</p>
          <p>Location: TBD</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>RSVP</button>
        </div>
      </div>
    </div>
  )
}
