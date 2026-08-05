import api from './api';

export const aiService = {
  async analyzeSustainability(metrics) {
    const res = await api.post('/ai/analyze', metrics);
    return res.data;
  },

  async getLatestReport() {
    const res = await api.get('/ai/latest');
    return res.data;
  }
};
