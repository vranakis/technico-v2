'use client';

import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthStatus {
  userId: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthStatus {
  fireReload: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthStatus>({ isAuthenticated: false, isAdmin: false, userId: "" });
  const [reload, setReload] = useState(false);
  const router = useRouter();

  const fireReload = () => {
    setReload((prevReload) => !prevReload);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token === 'mock-admin-token' && storedUserId) {
      setAuth({ isAuthenticated: true, isAdmin: true, userId: storedUserId});

    } else if (token === 'mock-user-token' && storedUserId) {
      setAuth({ isAuthenticated: true, isAdmin: false, userId: storedUserId });
    
    } else {
      setAuth({ isAuthenticated: false, isAdmin: false, userId: "" });
      console.log("no-token");
      if (window.location.pathname !== ('/login') && window.location.pathname !== ('/users/add-user')) router.push('/login');
      
    }
  }, [router, reload]);

  return (
    <AuthContext.Provider value={{ ...auth, fireReload }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
