import api from './api';

export const newsService = {
  async getNews(category = 'All', search = '') {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;

    const res = await api.get('/news', { params });
    return res.data;
  },

  async getAiDigest() {
    const res = await api.get('/news/ai-digest');
    return res.data;
  }
};
