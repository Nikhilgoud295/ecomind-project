import api from './api';

export const reportService = {
  async generateReport(reportParams) {
    const res = await api.post('/reports/generate', reportParams);
    return res.data;
  },

  async getReports() {
    const res = await api.get('/reports');
    return res.data;
  },

  async getReportById(id) {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  }
};
