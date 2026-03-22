import api from './axiosInstance';

export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data);
export const getPendingExperts = () => api.get('/admin/pending-experts').then((r) => r.data);
export const getPendingRecipes = () => api.get('/admin/pending-recipes').then((r) => r.data);
export const approveExpert = (id) => api.put(`/admin/experts/${id}/approve`).then((r) => r.data);
export const approveRecipe = (id) => api.put(`/admin/recipes/${id}/approve`).then((r) => r.data);
