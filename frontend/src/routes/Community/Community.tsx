export default function Community() {
  return (
    <div className="container">
      <h1>Community Forum</h1>
      <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Post</button>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        <div className="card">
          <h3>Sample Community Post</h3>
          <p>Category: Health & Care</p>
          <p>Sample post content about pet care...</p>
        </div>
      </div>
    </div>
  )
}
