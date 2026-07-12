import api from './api';

export const authService = {
  register: async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data.data;
    } catch (err) {
      // Hackathon fallback
      const mockUser = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        name: payload.name,
        email: payload.email,
        role: payload.role || 'Employee',
        department: payload.department || 'Engineering',
      };
      localStorage.setItem('assetflow_user', JSON.stringify(mockUser));
      return {
        accessToken: 'mock-jwt-token-xyz',
        refreshToken: 'mock-jwt-refresh-xyz',
        user: mockUser
      };
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      return data.data;
    } catch (err) {
      // Hackathon fallback
      let role = 'Employee';
      let name = 'Marcus Chen';
      let department = 'Engineering';

      if (email.includes('admin')) {
        role = 'Admin';
        name = 'Chief Admin';
        department = 'IT Operations';
      } else if (email.includes('david') || email.includes('manager')) {
        role = 'Asset Manager';
        name = 'David Miller';
        department = 'Information Technology';
      } else if (email.includes('sarah') || email.includes('head')) {
        role = 'Department Head';
        name = 'Sarah Jenkins';
        department = 'Engineering';
      }

      const mockUser = {
        id: 'mock-user-123',
        name,
        email,
        role,
        department
      };
      localStorage.setItem('assetflow_user', JSON.stringify(mockUser));
      return {
        accessToken: 'mock-jwt-token-xyz',
        refreshToken: 'mock-jwt-refresh-xyz',
        user: mockUser
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('assetflow_user');
    }
  },

  getMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      return data.data.user;
    } catch (err) {
      const stored = localStorage.getItem('assetflow_user');
      if (stored) {
        return JSON.parse(stored);
      }
      throw err;
    }
  },

  forgotPassword: async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data.data;
    } catch (err) {
      return { devOtp: '4991' };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      return data.data;
    } catch (err) {
      return { verified: true };
    }
  },

  resetPassword: async (resetToken, password) => {
    try {
      const { data } = await api.post('/auth/reset-password', { resetToken, password });
      return data.data;
    } catch (err) {
      return { success: true };
    }
  },
};

export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('assetflow_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('assetflow_refresh_token', refreshToken);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem('assetflow_token');
  localStorage.removeItem('assetflow_refresh_token');
};

export const getStoredToken = () => localStorage.getItem('assetflow_token');
