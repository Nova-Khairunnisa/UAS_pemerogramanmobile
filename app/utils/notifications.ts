import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushToken() {
  if (Platform.OS === 'web') return null;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Izin notifikasi ditolak');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('📲 DEVICE TOKEN:', token);

  return token;
}
