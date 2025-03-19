import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  token: string;
  setToken: (token: string) => void;
  role: string;
  setRole: (role: string) => void;
  accountName: string;
  setAccountName: (name: string) => void;
  apiUrl: string;
  apiUrlface: string;
  tokenauth: string;
  setTokenauth: (name: string) => void;
  groupId: string[]; 
  setGroupId: (groupId: string[]) => void;
  attendanceData: string[]; 
  setAttendanceData: (groupId: string[]) => void;
  activities: string[]; 
  setActivities: (groupId: string[]) => void;
  activitiesAd: string[]; 
  setActivitiesAd: (groupId: string[]) => void;
  groupList: string[];
  setGroupList: (groupId: string[]) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [tokenauth, setTokenauth] = useState<string>('');
  const [groupId, setGroupId] = useState([]);
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesAd, setActivitiesAd] = useState([]);
  const [groupList, setGroupList] = useState([]);
  


  const apiUrl = 'https://deploy-4vm6.onrender.com';
  let text = "https://deploy-4vm6.onrender.com";
  const apiUrlface = 'https://deploy-4vm6.onrender.com'
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = await AsyncStorage.getItem('role');

        if (storedEmail && storedToken) {
          setEmail(storedEmail);
          setToken(storedToken);
          setRole(storedRole || '');
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
        email,
        setEmail,
        token,
        setToken,
        role,
        setRole,
        accountName,
        setAccountName,
        apiUrl,
        apiUrlface,
        setTokenauth,
        tokenauth,
        groupId,
        setGroupId,
        attendanceData, setAttendanceData,
        activities, setActivities,
        activitiesAd, setActivitiesAd,
        groupList, setGroupList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
