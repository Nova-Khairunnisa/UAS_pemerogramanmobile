import { View, Text, StyleSheet } from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { profile } = useProfile();
  const { dark } = useTheme();

  return (
    <View style={[styles.container, dark && styles.dark]}>
      <Text style={styles.title}>📄 Data Mahasiswa</Text>

      <View style={styles.card}>
        <Text style={styles.item}>Nama :</Text>
        <Text style={styles.value}>{profile.nama || '-'}</Text>

        <Text style={styles.item}>Status :</Text>
        <Text style={styles.value}>
          {profile.mahasiswa ? 'Mahasiswa Aktif' : 'Bukan Mahasiswa'}
        </Text>

        <Text style={styles.item}>Persetujuan :</Text>
        <Text style={styles.value}>
          {profile.setuju ? 'Setuju' : 'Belum Setuju'}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2ff',
  },
  dark: {
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
  },
  item: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
