import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Landing from './routes/Landing/Landing'
import Login from './routes/Auth/Login'
import Signup from './routes/Auth/Signup'
import Dashboard from './routes/Dashboard/Dashboard'
import RescueMap from './routes/RescueMap/RescueMap'
import NearbyServices from './routes/NearbyServices/NearbyServices'
import LostFound from './routes/LostFound/LostFound'
import Adoption from './routes/Adoption/Adoption'
import Community from './routes/Community/Community'
import Events from './routes/Events/Events'
import Profile from './routes/Profile/Profile'
import Store from './routes/Store/Store'
import ProductDetail from './routes/Store/ProductDetail'
import SellerDashboard from './routes/Seller/SellerDashboard'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rescue-map" element={<RescueMap />} />
          <Route path="/nearby-services" element={<NearbyServices />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/adoptions" element={<Adoption />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/product/:id" element={<ProductDetail />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
