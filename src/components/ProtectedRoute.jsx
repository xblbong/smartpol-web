import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth();
        setIsAuthenticated(response.authenticated);
        
        if (response.authenticated && response.user) {
          // Update user data in localStorage if authenticated
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;