import api from './axiosInstance';

export const generatePrescription = async (healthProfileData) => {
  const res = await api.post('/prescription/generate', healthProfileData);
  return res.data;
};

export const getMyPrescriptions = async () => {
  const res = await api.get('/prescription/mine');
  return res.data;
};
