import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  token: string;
  setToken: (token: string) => void;
  role: string;
  setRole: (role: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  apiUrl: string;
  tokenauth: string;
  setTokenauth: (name: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [tokenauth, setTokenauth] = useState<string>('');
  const apiUrl = 'http://192.168.10.72:8000';

  // Khôi phục trạng thái đăng nhập từ AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');
        const storedLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (storedLoggedIn === 'true' && storedEmail && storedToken) {
          setEmail(storedEmail);
          setToken(storedToken);
          setRole(storedRole || '');
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải dữ liệu đăng nhập:', error);
      }
    };

    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        email,
        setEmail,
        token,
        setToken,
        role,
        setRole,
        accountName,
        setAccountName,
        apiUrl,
        setTokenauth,
        tokenauth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
