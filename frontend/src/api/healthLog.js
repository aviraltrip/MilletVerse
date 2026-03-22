import api from './axiosInstance';

export const getMyLogs = () => api.get('/health-logs').then((r) => r.data);
export const createLog = (data) => api.post('/health-logs', data).then((r) => r.data);
export const deleteLog = (id) => api.delete(`/health-logs/${id}`).then((r) => r.data);
