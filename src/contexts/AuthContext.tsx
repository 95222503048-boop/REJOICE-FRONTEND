import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient, type APIError } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'customer';
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{ user: User }>('/api/auth/me');
        setUser(response.user);
      } catch (err) {
        // No active session, which is normal on first load
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ user: User }>('/api/auth/login', {
        email,
        password,
      });
      setUser(response.user);
    } catch (err) {
      const apiError = err as APIError;
      const message = apiError.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
      // Clear user state even if logout fails
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'customer';
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ user: User }>('/api/auth/register', userData);
      setUser(response.user);
    } catch (err) {
      const apiError = err as APIError;
      const message = apiError.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
