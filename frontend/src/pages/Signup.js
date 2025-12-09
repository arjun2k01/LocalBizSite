import React, { useState } from 'react';
import axios from 'axios';

function Signup({ apiUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        name,
        email,
        password,
      });
      setMessage('Signup successful! Please login.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
