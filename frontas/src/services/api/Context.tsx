import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  role: string | null;
  setRole: (role: string | null) => void;
  userId: number | null; // Add userId to the context
  setUserId: (userId: number | null) => void; // Add a setter for userId
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // Initialize userId state

  return (
    <AuthContext.Provider value={{ role, setRole, userId, setUserId }}>
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
