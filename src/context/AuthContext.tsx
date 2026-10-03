import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrCreateGuestToken } from '../lib/draftStorage.ts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  guestToken: string;
  isAdmin: boolean;
  loginAsCustomer: (email?: string, name?: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestToken, setGuestToken] = useState<string>('');

  useEffect(() => {
    setGuestToken(getOrCreateGuestToken());
  }, []);

  const loginAsCustomer = (email = 'nithishelangovan.it@gmail.com', name = 'Nithish Elangovan') => {
    setUser({
      id: 'usr_cust_' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      role: 'customer'
    });
  };

  const loginAsAdmin = () => {
    setUser({
      id: 'usr_admin_master',
      name: 'Operations Dispatcher',
      email: 'admin@onemart.internal',
      role: 'admin'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guestToken,
        isAdmin: user?.role === 'admin',
        loginAsCustomer,
        loginAsAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
