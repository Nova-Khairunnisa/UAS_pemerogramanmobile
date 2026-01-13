import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Login() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (nim === '123456' && password === 'admin') {
      await AsyncStorage.setItem('isLogin', 'true');
      router.replace('/(tabs)');
    } else {
      alert('NIM atau Password salah');
    }
  };

  return (
    <View style={styles.container}>
      {/* Small Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          UAS Pemrograman Mobile
        </Text>

        <TextInput
          placeholder="NIM"
          placeholderTextColor="#9ca3af"
          value={nim}
          onChangeText={setNim}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2025 Nova</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4f46e5',
  },

  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 18,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    color: '#111827',
  },

  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: '#6b7280',
  },
});
