import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://localbizsite.onrender.com/api';

function BusinessList({ apiUrl }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/businesses`);
      setBusinesses(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load businesses: ' + (err.message || 'Unknown error'));
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading businesses...</p></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <p className="error">{error}</p>
          <button className="button" onClick={fetchBusinesses}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Local Businesses</h1>
      {businesses.length === 0 ? (
        <div className="card">
          <p>No businesses found.</p>
        </div>
      ) : (
        <div className="businesses-grid">
          {businesses.map((business) => (
            <div key={business._id} className="card">
              <h3>{business.name}</h3>
              <p>{business.description}</p>
              <p><strong>Category:</strong> {business.category}</p>
              <p><strong>Location:</strong> {business.location}</p>
              {business.phone && <p><strong>Phone:</strong> {business.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusinessList;
