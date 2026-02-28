import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { auth as authApi } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authApi.getUser());
  const [token, setToken] = useState<string | null>(() => authApi.getToken());

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    authApi.setToken(res.token);
    authApi.setUser(res.user);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    authApi.setToken(res.token);
    authApi.setUser(res.user);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    authApi.clearToken();
    authApi.clearUser();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
    isLoggedIn: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
