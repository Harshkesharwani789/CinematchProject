import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = { name: 'CineMatch User', email };
    setUser(mockUser);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const signup = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = { name, email };
    setUser(mockUser);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const updateProfile = async (name) => {
    const updatedUser = { ...user, name };
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const changePassword = async (oldPassword, newPassword) => {
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
