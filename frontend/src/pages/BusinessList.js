import React, { useState, useEffect } from 'react';

function BusinessList() {
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Local Cafe', category: 'Food & Beverage', address: '123 Main St', rating: 4.5 },
    { id: 2, name: 'Tech Startup', category: 'Technology', address: '456 Oak Ave', rating: 4.8 },
    { id: 3, name: 'Beauty Salon', category: 'Services', address: '789 Elm Rd', rating: 4.2 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://localbizsite.onrender.com/api/businesses');
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      }
    } catch (err) {
      console.log('Using mock data due to API error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Local Businesses</h1>
      {loading && <p>Loading businesses...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {businesses.map((business) => (
          <div key={business.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>{business.name}</h3>
            <p><strong>Category:</strong> {business.category}</p>
            <p><strong>Address:</strong> {business.address}</p>
            <p><strong>Rating:</strong> {business.rating} / 5</p>
            <button style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BusinessList;
