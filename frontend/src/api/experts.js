import api from './axiosInstance';

export const getExperts = () => api.get('/experts').then((r) => r.data);
export const getExpertById = (id) => api.get(`/experts/${id}`).then((r) => r.data);
export const applyAsExpert = (data) => api.post('/experts/apply', data).then((r) => r.data);
export const submitExpertRecipe = (data) => api.post('/experts/recipes', data).then((r) => r.data);
