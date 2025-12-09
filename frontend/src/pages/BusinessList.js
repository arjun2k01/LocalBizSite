import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://localbizsite.onrender.com/api';

function BusinessList() {
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
      setError(err.message);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Local Businesses</h1>
          <p className="text-xl text-gray-600">Discover amazing local businesses in your area</p>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Failed to load businesses</h3>
                <p className="text-red-700 mt-2">{error}</p>
                <button
                  onClick={fetchBusinesses}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No businesses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Business Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500 overflow-hidden">
                  {business.image ? (
                    <img
                      src={business.image}
                      alt={business.name || 'Business'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Business Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{business.name || 'Unknown Business'}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description || 'No description'}</p>

                  <div className="space-y-3 mb-6">
                    {business.category && (
                      <div className="flex items-center text-gray-700">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                          {business.category}
                        </span>
                      </div>
                    )}

                    {business.address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{business.address}</span>
                      </div>
                    )}

                    {business.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.02 1.614 2.914 3.101 4.401 1.487 1.487 3.38 2.683 4.4 3.101l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <a href={`tel:${business.phone}`} className="text-sm hover:text-green-600 transition-colors">
                          {business.phone}
                        </a>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a href={`mailto:${business.email}`} className="text-sm hover:text-green-600 transition-colors break-all">
                          {business.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessList;cat frontend/src/pages/Home.js
cat > frontend/src/pages/Home.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to <span className="text-green-600">LocalBizSite</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover amazing local businesses in your area. Support small businesses and find exactly what you're looking for.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/businesses"
                className="inline-block px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200 text-center shadow-lg hover:shadow-xl"
              >
                Explore Businesses
              </Link>
              <button className="px-8 py-4 border-2 border-green-500 text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors duration-200">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">500+</p>
                <p className="text-gray-600 text-sm mt-1">Businesses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">50k+</p>
                <p className="text-gray-600 text-sm mt-1">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">100%</p>
                <p className="text-gray-600 text-sm mt-1">Verified</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 rounded-3xl opacity-10 blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center">
              <svg className="w-48 h-48 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose LocalBizSite?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-green-50 transition-colors">
              <div className="inline-block p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">Find the business you need instantly with our fast search and filter options.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-green-50 transition-colors">
              <div className="inline-block p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Verified Listings</h3>
              <p className="text-gray-600">Every business is verified to ensure you get accurate and reliable information.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-4 p-6 rounded-xl hover:bg-green-50 transition-colors">
              <div className="inline-block p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Easy to Use</h3>
              <p className="text-gray-600">Simple, intuitive interface makes browsing businesses a breeze.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-4xl font-bold">Ready to find your favorite local business?</h2>
          <p className="text-lg opacity-90">Browse through our extensive directory and discover amazing local businesses near you.</p>
          <Link
            to="/businesses"
            className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Exploring Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
EOF
git add -A && git commit -m 'PHASE 2: Improve UI/UX - Enhanced business cards with responsive design and improved home page hero' && git push origin main
echo 'Push completed'
git status
