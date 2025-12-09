import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import BusinessList from './pages/BusinessList';
import Login from './pages/Login';
import Signup from './pages/Signup';

const API_URL = 'https://localbizsite.onrender.com/api';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              LocalBizSite
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/businesses" className="nav-link">Businesses</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link">Signup</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<BusinessList apiUrl={API_URL} />} />
          <Route path="/login" element={<Login apiUrl={API_URL} />} />
          <Route path="/signup" element={<Signup apiUrl={API_URL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
