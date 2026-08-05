import api from './api';

export const usageService = {
  async addUsage(usageData) {
    const res = await api.post('/usage', usageData);
    return res.data;
  },

  async getUsage(params = {}) {
    const res = await api.get('/usage', { params });
    return res.data;
  },

  async updateUsage(id, usageData) {
    const res = await api.put(`/usage/${id}`, usageData);
    return res.data;
  },

  async deleteUsage(id) {
    const res = await api.delete(`/usage/${id}`);
    return res.data;
  },

  async getAnalytics() {
    const res = await api.get('/analytics');
    return res.data;
  }
};
