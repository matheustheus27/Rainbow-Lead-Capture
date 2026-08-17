import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials } from '../types/auth';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AUTH_TOKEN_KEY = 'iris_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate existing stored token on app boot
  useEffect(() => {
    let isMounted = true;

    const verifyExistingToken = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const verifiedUser = await ApiService.verifySession(storedToken);
        if (isMounted) {
          if (verifiedUser) {
            setUser(verifiedUser);
            setToken(storedToken);
          } else {
            // Invalid or expired token
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyExistingToken();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await ApiService.login(credentials);
    if (response.token && response.user) {
      setToken(response.token);
      setUser(response.user);
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      } catch (e) {
        console.warn('Could not save auth token to localStorage:', e);
      }
    } else {
      throw new Error('Authentication succeeded but token was missing.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Could not remove auth token from localStorage:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
