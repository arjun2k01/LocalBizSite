import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'https://localbizsite.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios to include token in requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }, [token]);

  // Validate token on app load
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await axios.post(`${API_URL}/auth/validate-token`, { token });
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.log('Token validation failed, clearing auth state');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const signup = async (email, password, fullName) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        fullName,
      });
      const newToken = response.data.token;
      setToken(newToken);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const newToken = response.data.token;
      setToken(newToken);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setToken(null);
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;