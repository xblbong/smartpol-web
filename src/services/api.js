import axios from 'axios';

// Base URL untuk backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response dan error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, hapus dari localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirect ke login jika diperlukan
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { access_token, user } = response.data;
      
      // Simpan token dan user data ke localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
      // Hapus token dan user data dari localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } catch (error) {
      // Tetap hapus data lokal meskipun request gagal
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

// Utility functions
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('access_token');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export default api;