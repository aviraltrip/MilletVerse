import React, { createContext, useState, useContext } from 'react';
import { loginUser, registerUser, logoutUser } from '../api/auth';
import { setAuthToken } from '../api/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // No async bootstrap, always starts ready

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
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, role: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
};
