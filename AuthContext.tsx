import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRecord } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: UserRecord;
  isAdmin: boolean;
  login: (email: string) => Promise<UserRecord>;
  loginAsResidentDemo: () => UserRecord;
  loginAsAdminDemo: () => UserRecord;
  registerResident: (data: {
    name: string;
    email: string;
    phone: string;
    building: string;
    apartmentNumber: string;
  }) => Promise<UserRecord>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserRecord>(authService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string) => {
    const user = await authService.login(email);
    setCurrentUser(user);
    return user;
  };

  const loginAsResidentDemo = () => {
    const user = authService.loginAsResidentDemo();
    setCurrentUser(user);
    return user;
  };

  const loginAsAdminDemo = () => {
    const user = authService.loginAsAdminDemo();
    setCurrentUser(user);
    return user;
  };

  const registerResident = async (data: {
    name: string;
    email: string;
    phone: string;
    building: string;
    apartmentNumber: string;
  }) => {
    const user = await authService.registerResident(data);
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser.role === 'admin',
        login,
        loginAsResidentDemo,
        loginAsAdminDemo,
        registerResident,
        logout
      }}
    >
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
