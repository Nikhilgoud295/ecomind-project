import api from './api';

export const validateEmailSyntax = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, message: 'Please enter your email address.' };
  }

  const trimmed = email.trim().toLowerCase();

  // Strict RFC 5322 Email Syntax Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { 
      valid: false, 
      message: '❌ Invalid Email Syntax: Please enter a valid email address (e.g., user@company.com).' 
    };
  }

  // Common Domain Typo Detection (e.g., gamil.com, gmial.com, yaho.com)
  const parts = trimmed.split('@');
  const domainPart = parts[1] || '';

  const commonTypos = {
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.co': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yaho.co': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'hotmai.com': 'hotmail.com'
  };

  if (commonTypos[domainPart]) {
    const suggestion = commonTypos[domainPart];
    return {
      valid: false,
      message: `❌ Invalid Email Domain Syntax: "@${domainPart}" is invalid. Did you mean "@${suggestion}"?`
    };
  }

  return { valid: true, email: trimmed };
};

export const authService = {
  validateEmailSyntax,

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('ecomind_token', res.data.token);
      localStorage.setItem('ecomind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async faceLogin(data) {
    const res = await api.post('/auth/face-login', data);
    if (res.data.token) {
      localStorage.setItem('ecomind_token', res.data.token);
      localStorage.setItem('ecomind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async fingerprintLogin(data) {
    const res = await api.post('/auth/fingerprint-login', data);
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
