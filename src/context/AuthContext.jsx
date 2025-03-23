import { createContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth check error:', err);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // If registration is successful, log the user in
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};