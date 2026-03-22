import api, { setAuthToken } from './axiosInstance';

export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  if (res.data.accessToken) {
    setAuthToken(res.data.accessToken);
  }
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data);
  if (res.data.accessToken) {
    setAuthToken(res.data.accessToken);
  }
  return res.data;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
  setAuthToken(null);
};
