import axios from 'axios';

// Base URL untuk backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Untuk mengirim cookies/session
});

// Interceptor untuk menangani response dan error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Session expired atau invalid, hapus semua data dari localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      
      // Redirect berdasarkan path saat ini
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin') || currentPath.includes('/dashboard')) {
        window.location.href = '/admin-login';
      } else {
        window.location.href = '/login';
      }
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
      const { user } = response.data;
      
      // Simpan user data ke localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      const { user, token } = response.data;
      
      // Simpan admin data ke localStorage
      localStorage.setItem('admin', JSON.stringify(user));
      localStorage.setItem('adminToken', token);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/logout');
      // Hapus user data dari localStorage
      localStorage.removeItem('user');
    } catch (error) {
      // Tetap hapus data lokal meskipun request gagal
      localStorage.removeItem('user');
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Admin logout
  adminLogout: async () => {
    try {
      await api.post('/admin/logout');
      // Hapus admin data dari localStorage
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
    } catch (error) {
      // Tetap hapus data lokal meskipun request gagal
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
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

  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile/update', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Verify NIK
  verifyNIK: async (nikData) => {
    try {
      const response = await api.post('/profile/verify-nik', nikData);
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

// Polling API functions
export const pollingAPI = {
  // Get all polls
  getPolls: async () => {
    try {
      const response = await api.get('/polling');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Create new poll
  createPoll: async (pollData) => {
    try {
      const response = await api.post('/polling', pollData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Vote on a poll
  vote: async (pollId, optionId) => {
    try {
      const response = await api.post(`/polling/${pollId}/vote`, { option_id: optionId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

// Policies API functions
export const policiesAPI = {
  // Get all policies
  getPolicies: async () => {
    try {
      const response = await api.get('/policies');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Create new policy
  createPolicy: async (policyData) => {
    try {
      const response = await api.post('/policies', policyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

// Reports API functions
export const reportAPI = {
  // Get all reports
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Create new report
  createReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get specific report
  getReport: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Update report (admin only)
  updateReport: async (reportId, reportData) => {
    try {
      const response = await api.put(`/reports/${reportId}`, reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Delete report (admin only)
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get report statistics (admin only)
  getReportStats: async () => {
    try {
      const response = await api.get('/reports/stats');
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

export const isAuthenticated = async () => {
  try {
    const response = await authAPI.checkAuth();
    return response.authenticated;
  } catch (error) {
    return false;
  }
};

// Admin API functions
export const adminAPI = {
  // User management
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  // Poll management
  updatePoll: async (pollId, pollData) => {
    try {
      const response = await api.put(`/admin/polls/${pollId}`, pollData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  deletePoll: async (pollId) => {
    try {
      const response = await api.delete(`/admin/polls/${pollId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  // Policy management
  updatePolicy: async (policyId, policyData) => {
    try {
      const response = await api.put(`/admin/policies/${policyId}`, policyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },
  
  deletePolicy: async (policyId) => {
    try {
      const response = await api.delete(`/admin/policies/${policyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },



  getDashboardQuickStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/quick-stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },


};

// Chat History API
export const chatAPI = {
  // Get chat history
  getChatHistory: async (sessionId = null) => {
    try {
      const url = sessionId ? `/chat/history?session_id=${sessionId}` : '/chat/history';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Save chat message
  saveChatMessage: async (message, isUser, sessionId = null) => {
    try {
      const response = await api.post('/chat/history', {
        message,
        is_user: isUser,
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get chat sessions
  getChatSessions: async () => {
    try {
      const response = await api.get('/chat/sessions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get user context for chatbot
  getUserContext: async () => {
    try {
      const response = await api.get('/chatbot/user-context');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get user preferences for chatbot
  getUserPreferences: async () => {
    try {
      const response = await api.get('/chatbot/user-preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Update user preferences for chatbot
  updateUserPreferences: async (preferences) => {
    try {
      const response = await api.post('/chatbot/user-preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

export default api;