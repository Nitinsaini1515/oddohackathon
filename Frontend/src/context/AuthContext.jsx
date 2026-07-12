import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authService,
  setAuthTokens,
  clearAuthTokens,
  getStoredToken,
} from '../services/auth.service';
import { mapUser } from '../utils/apiMappers';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await authService.getMe();
      setUser(mapUser(me));
    } catch {
      clearAuthTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
    };
    window.addEventListener('assetflow:auth-expired', onExpired);
    return () => window.removeEventListener('assetflow:auth-expired', onExpired);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setAuthTokens(result.accessToken, result.refreshToken);
    const mapped = mapUser(result.user);
    setUser(mapped);
    window.dispatchEvent(new Event('assetflow:auth-change'));
    return mapped;
  };

  const register = async (payload) => {
    const result = await authService.register(payload);
    setAuthTokens(result.accessToken, result.refreshToken);
    const mapped = mapUser(result.user);
    setUser(mapped);
    window.dispatchEvent(new Event('assetflow:auth-change'));
    return mapped;
  };

  const logout = async () => {
    await authService.logout();
    clearAuthTokens();
    setUser(null);
    window.dispatchEvent(new Event('assetflow:auth-change'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
