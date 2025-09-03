import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const AdminProtectedRoute = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const admin = localStorage.getItem('admin');
        const adminToken = localStorage.getItem('adminToken');
        
        if (admin && adminToken) {
          const adminData = JSON.parse(admin);
          // Verifikasi bahwa user adalah admin
          if (adminData.role === 'admin') {
            setIsAdminAuthenticated(true);
          } else {
            setIsAdminAuthenticated(false);
          }
        } else {
          setIsAdminAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setIsAdminAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
        <span className="ml-3">Memverifikasi akses admin...</span>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;