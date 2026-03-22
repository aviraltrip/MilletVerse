import api from './axiosInstance';

export const interpretDoctorNote = (text) =>
  api.post('/ai/interpret-note', { noteText: text }).then((r) => r.data);

export const generateAiRecipe = (payload) =>
  api.post('/ai/generate-recipe', payload).then((r) => r.data);
