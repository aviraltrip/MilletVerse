import api from './axiosInstance';

export const getMillets = () => api.get('/millets').then((r) => r.data);
export const getMilletById = (id) => api.get(`/millets/${id}`).then((r) => r.data);
