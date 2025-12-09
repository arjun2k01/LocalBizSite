import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to LocalBizSite</h1>
        <p>Discover amazing local businesses in your area</p>
        <Link to="/businesses" className="button">
          Explore Businesses
        </Link>
      </div>
    </div>
  );
}

export default Home;
