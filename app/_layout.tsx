import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('isLogin').then((res) => {
      setIsLogin(res === 'true');
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <AppThemeProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {!isLogin ? (
            <Stack.Screen name="login" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </ProfileProvider>
    </AppThemeProvider>
  );
}
