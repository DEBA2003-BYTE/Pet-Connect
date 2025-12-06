import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container nav-content">
          <h2 className="logo">🐾 PetConnect</h2>
          <div className="nav-buttons">
            <Link to="/auth/login" className="btn btn-secondary">Login</Link>
            <Link to="/auth/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>
      <header className="hero">
        <div className="container">
          <h1>PetConnect</h1>
          <p>Care for Every Paw - Connecting Communities for Pet and Street Animal Welfare</p>
          <div className="cta-buttons">
            <Link to="/auth/signup" className="btn btn-primary btn-large">Get Started</Link>
            <Link to="/rescue-map" className="btn btn-secondary btn-large">Report Animal in Need</Link>
          </div>
        </div>
      </header>
      <section className="features container">
        <div className="feature-card">
          <h3>🚨 Real-Time Rescue</h3>
          <p>Report injured animals and connect with nearby volunteers instantly</p>
        </div>
        <div className="feature-card">
          <h3>🏥 Find Services</h3>
          <p>Locate vets, clinics, groomers, and pet-friendly places</p>
        </div>
        <div className="feature-card">
          <h3>🐾 Lost & Found</h3>
          <p>Help reunite lost pets with their families</p>
        </div>
        <div className="feature-card">
          <h3>❤️ Adoption Network</h3>
          <p>Find your perfect companion from verified NGOs</p>
        </div>
      </section>
    </div>
  )
}
