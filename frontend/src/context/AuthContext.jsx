import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/auth';
import api, { setAuthToken } from '../api/axiosInstance';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to silently refresh token on load if logged in before
    const bootstrapAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data;
        if (accessToken) {
          setAuthToken(accessToken);
          // Just set basic auth state - user profile fetched differently if req token info
          // Since we need user details, typically the token has them or we decode it
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          setUser({ id: payload.id, role: payload.role });
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, role: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
};
