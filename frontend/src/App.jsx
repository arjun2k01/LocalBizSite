import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import './App.css'

const API_URL = 'https://localbizsite.onrender.com/api'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">🏢 LocalBizSite</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/businesses">Businesses</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      </div>
    </nav>
  )
}

function Home() {
  return (
    <div className="hero">
      <h1>Welcome to LocalBizSite</h1>
      <p>Discover and review local businesses in your area</p>
      <Link to="/businesses" className="btn btn-primary">Browse Businesses</Link>
    </div>
  )
}

function BusinessList() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API_URL}/businesses`)
      setBusinesses(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load businesses. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><p>Loading businesses...</p></div>
  if (error) return <div className="container error"><p>{error}</p></div>

  return (
    <div className="container">
      <h2>Local Businesses</h2>
      <div className="business-grid">
        {businesses.length === 0 ? (
          <p>No businesses found. Start by creating one!</p>
        ) : (
          businesses.map(business => (
            <div key={business._id} className="business-card">
              <h3>{business.name}</h3>
              <p className="category">📍 {business.category || 'Uncategorized'}</p>
              <p className="description">{business.description}</p>
              {business.rating && <p className="rating">⭐ {business.rating.toFixed(1)}</p>}
              <p className="owner">Owner: {business.owner || 'N/A'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      localStorage.setItem('token', response.data.token)
      setMessage('Login successful!')
      setEmail('')
      setPassword('')
    } catch (err) {
      setMessage('Login failed. Check your credentials.')
    }
  }

  return (
    <div className="container form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'visitor'
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/auth/signup`, formData)
      setMessage('Sign up successful! You can now login.')
      setFormData({ name: '', email: '', password: '', role: 'visitor' })
    } catch (err) {
      setMessage('Sign up failed. Try again.')
    }
  }

  return (
    <div className="container form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="visitor">Visitor</option>
          <option value="business_owner">Business Owner</option>
        </select>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<BusinessList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <footer className="footer">
          <p>&copy; 2025 LocalBizSite. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
