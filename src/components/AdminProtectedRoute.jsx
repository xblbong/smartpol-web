import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { authAPI } from '../services/api';

const AdminProtectedRoute = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const admin = localStorage.getItem('admin');
        const adminToken = localStorage.getItem('adminToken');
        
        // Block direct access to /admin without proper authentication
        if (!admin || !adminToken) {
          setIsAdminAuthenticated(false);
          setLoading(false);
          return;
        }

        const adminData = JSON.parse(admin);
        
        // Verifikasi bahwa user adalah admin dan data valid
        if (!adminData.role || adminData.role !== 'admin' || !adminData.id || !adminData.username) {
          // Clear invalid admin session
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          setIsAdminAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify session with backend - ensure admin role
        try {
          const response = await authAPI.checkAuth();
          if (response.data.user && response.data.user.role === 'admin') {
            setIsAdminAuthenticated(true);
          } else {
            // Clear invalid admin session
            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');
            setIsAdminAuthenticated(false);
          }
        } catch (authError) {
          // Session tidak valid di backend, hapus data lokal
          localStorage.removeItem('admin');
          localStorage.removeItem('adminToken');
          setIsAdminAuthenticated(false);
        }
        
      } catch (error) {
        console.error('Admin auth check failed:', error);
        // Clear corrupted admin session
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
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