import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('redline_token'));
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('redline_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getCurrentUser();
      setUser(res.user);
    } catch {
      localStorage.removeItem('redline_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await api.login({ identifier, password: pass });
    localStorage.setItem('redline_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (username: string, email: string, pass: string) => {
    const res = await api.register({ username, email, password: pass });
    localStorage.setItem('redline_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('redline_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
