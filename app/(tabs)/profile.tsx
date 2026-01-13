import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { profile, setProfile } = useProfile();
  const { dark, setDark } = useTheme();

  /* PICK IMAGE */
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Izin galeri ditolak');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setProfile({
        ...profile,
        photo: result.assets[0].uri,
      });
    }
  };

  return (
    <View style={[styles.container, dark && styles.containerDark]}>

      {/* Header */}
      <View style={[styles.header, dark && styles.headerDark]}>
        <Text style={styles.headerTitle}>👤 Biodata Mahasiswa</Text>
        <Text style={styles.headerSubtitle}>
          Lengkapi data diri kamu
        </Text>
      </View>

      {/* Card */}
      <View style={[styles.card, dark && styles.cardDark]}>

        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={pickImage}
        >
<Image
  source={
    profile.photo
      ? { uri: profile.photo }
      : require('../../assets/images.png')
  }
  style={styles.avatar}
/>

          <Text style={styles.changePhoto}>
            Ubah Foto
          </Text>
        </TouchableOpacity>

        {/* Nama */}
        <Text style={[styles.label, dark && styles.textDark]}>
          Nama Lengkap
        </Text>
        <TextInput
          placeholder="Masukkan nama"
          placeholderTextColor="#9ca3af"
          value={profile.nama}
          onChangeText={(text) =>
            setProfile({ ...profile, nama: text })
          }
          style={[styles.input, dark && styles.inputDark]}
        />

        {/* Switch Mahasiswa */}
        <View style={styles.row}>
          <Text style={[styles.rowText, dark && styles.textDark]}>
            Status Mahasiswa
          </Text>
          <Switch
            value={profile.mahasiswa}
            onValueChange={(val) =>
              setProfile({ ...profile, mahasiswa: val })
            }
          />
        </View>

        {/* Checkbox */}
        <View style={styles.row}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={profile.setuju}
              onValueChange={(val) =>
                setProfile({ ...profile, setuju: val })
              }
            />
            <Text
              style={[
                styles.checkboxText,
                dark && styles.textDark,
              ]}
            >
              Setuju dengan ketentuan
            </Text>
          </View>
        </View>

        {/* Dark Mode */}
        <View style={styles.row}>
          <Text style={[styles.rowText, dark && styles.textDark]}>
            Dark Mode
          </Text>
          <Switch value={dark} onValueChange={setDark} />
        </View>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#111827',
  },

  header: {
    backgroundColor: '#6366f1',
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
  },
  headerDark: {
    backgroundColor: '#1f2937',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#c7d2fe',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },

  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e5e7eb',
  },
  changePhoto: {
    marginTop: 8,
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#f9fafb',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  rowText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#374151',
  },

  textDark: {
    color: '#f9fafb',
  },
});
