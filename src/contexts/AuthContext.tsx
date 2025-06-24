
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // Mock authentication - in real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          email: 'admin@school.edu.bd',
          name: 'Admin User',
          role: 'admin' as const,
          phone: '+880123456789',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          email: 'teacher@school.edu.bd',
          name: 'রহিম আহমেদ',
          role: 'teacher' as const,
          phone: '+880123456790',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          email: 'student@school.edu.bd',
          name: 'করিম উদ্দিন',
          role: 'student' as const,
          phone: '+880123456791',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const foundUser = mockUsers.find(u => u.email === credentials.email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
