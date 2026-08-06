import api from './api';

export const newsService = {
  async getNews(category = 'All', search = '', industry = 'All') {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    if (industry && industry !== 'All') params.industry = industry;

    const res = await api.get('/news', { params });
    return res.data;
  },

  async getAiDigest() {
    const res = await api.get('/news/ai-digest');
    return res.data;
  },

  async getAiRecommendations(orgProfile = {}) {
    const res = await api.post('/news/ai-recommendations', orgProfile);
    return res.data;
  }
};
