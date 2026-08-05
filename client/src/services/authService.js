import api from './api';

export const authService = {
  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('ecomind_token', res.data.token);
      localStorage.setItem('ecomind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('ecomind_token', res.data.token);
      localStorage.setItem('ecomind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/auth/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.user) {
      localStorage.setItem('ecomind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('ecomind_token');
    localStorage.removeItem('ecomind_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('ecomind_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('ecomind_token');
  }
};
