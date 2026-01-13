import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushToken } from '../utils/notifications';

/* 🔔 Request permission notifikasi (LOCAL) */
async function requestPermission() {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Izin notifikasi ditolak');
  }
}

/* 🔔 Notifikasi tugas */
async function showTaskNotification(count: number) {
  if (Platform.OS === 'web') return;
  if (count === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📌 Tugas Belum Dikumpulkan',
      body: `Kamu punya ${count} tugas yang belum dikumpulkan`,
    },
    trigger: null,
  });
}

export default function HomeScreen() {
  const [pendingTasks, setPendingTasks] = useState(0);

  /* 🔔 Load jumlah tugas dari local storage */
  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const tasks = JSON.parse(data);
      const belum = tasks.filter((t: any) => !t.done).length;
      setPendingTasks(belum);
      showTaskNotification(belum);
    }
  };

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah kamu yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear(); // atau removeItem('user')
            router.replace('/login');   // arahkan ke login
          },
        },
      ]
    );
  };

  useEffect(() => {
    requestPermission();       // Local notification
    loadTasks();               // Hitung tugas
    registerForPushToken();    // 🔥 Push Token (Level 10)
  }, []);

  return (
    <View style={styles.menu}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.buttonTitle}>👤 Profile</Text>
        <Text style={styles.buttonDesc}>Lihat data diri mahasiswa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/about')}
      >
        <Text style={styles.buttonTitle}>ℹ️ About</Text>
        <Text style={styles.buttonDesc}>Informasi aplikasi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/users')}
      >
        <Text style={styles.buttonTitle}>👥 Users</Text>
        <Text style={styles.buttonDesc}>Data user dari API</Text>
      </TouchableOpacity>

      {/* 🔔 TASKS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/tasks')}
      >
        <View style={styles.row}>
          <Text style={styles.buttonTitle}>📝 Tasks</Text>

          {pendingTasks > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingTasks}</Text>
            </View>
          )}
        </View>

        <Text style={styles.buttonDesc}>
          {pendingTasks > 0
            ? `${pendingTasks} tugas belum dikumpulkan`
            : 'Semua tugas sudah dikumpulkan'}
        </Text>
      </TouchableOpacity>

      {/* 📊 KHS */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/khs')}
      >
        <Text style={styles.buttonTitle}>📊 KHS</Text>
        <Text style={styles.buttonDesc}>
          Lihat Kartu Hasil Studi per semester
        </Text>
      </TouchableOpacity>

      {/* 🚪 LOGOUT */}
      <TouchableOpacity
        style={[styles.button, styles.logoutBtn]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonTitle, { color: '#dc2626' }]}>
          🚪 Logout
        </Text>
        <Text style={styles.buttonDesc}>
          Keluar dari akun
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    gap: 16,
    padding: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff5f5',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  buttonDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#dc2626',
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
