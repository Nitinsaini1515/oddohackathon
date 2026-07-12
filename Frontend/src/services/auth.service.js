import api from './api';

export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    }
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data.data;
  },

  verifyOtp: async (email, otp) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data.data;
  },

  resetPassword: async (resetToken, password) => {
    const { data } = await api.post('/auth/reset-password', { resetToken, password });
    return data.data;
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
