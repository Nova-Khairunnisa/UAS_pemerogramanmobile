import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Platform,
  Switch,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';

type Task = {
  id: string;
  title: string;
  done: boolean;
  photo?: string;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  /* ================== PERMISSION ================== */
  const requestPermission = async () => {
    if (Platform.OS === 'web') return;
    await Notifications.requestPermissionsAsync();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  /* ================== NOTIFICATION ================== */
  const showTaskNotification = async (count: number) => {
    if (Platform.OS === 'web' || count === 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📌 Tugas Belum Dikumpulkan',
        body: `Kamu punya ${count} tugas yang belum dikerjakan`,
      },
      trigger: null,
    });
  };

  const showTaskDoneNotification = async (title: string) => {
    if (Platform.OS === 'web') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Tugas Berhasil Dikumpulkan',
        body: `Tugas "${title}" sudah berhasil dikumpulkan`,
      },
      trigger: null,
    });
  };

  /* ================== STORAGE ================== */
  useEffect(() => {
    requestPermission();
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('tasks');
    if (data) {
      const parsed: Task[] = JSON.parse(data);
      setTasks(parsed);
      showTaskNotification(parsed.filter(t => !t.done).length);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    showTaskNotification(newTasks.filter(t => !t.done).length);
  };

  /* ================== CRUD ================== */
  const addTask = () => {
    if (!text) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: text,
      done: false,
    };
    saveTasks([...tasks, newTask]);
    setText('');
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = () => {
    if (!selected) return;

    const updated = tasks.map(t =>
      t.id === selected.id ? selected : t
    );

    saveTasks(updated);

    if (selected.done) {
      showTaskDoneNotification(selected.title);
    }

    setModalVisible(false);
  };

  /* ================== IMAGE PICKER ================== */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && selected) {
      setSelected({
        ...selected,
        photo: result.assets[0].uri,
        done: true,
      });
    }
  };

  /* ================== UI ================== */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Daftar Tugas</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Tambah tugas..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskText}>
              {item.done ? '✅ ' : '❌ '} {item.title}
            </Text>

            {item.photo && (
              <Image source={{ uri: item.photo }} style={styles.preview} />
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setSelected(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.delete}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ================== MODAL ================== */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit / Kumpulkan Tugas</Text>

            <TextInput
              value={selected?.title}
              onChangeText={t =>
                setSelected({ ...selected!, title: t })
              }
              style={styles.input}
            />

            <View style={styles.switchRow}>
              <Text>Selesai</Text>
              <Switch
                value={selected?.done}
                onValueChange={val =>
                  setSelected({ ...selected!, done: val })
                }
              />
            </View>

            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.btnText}>📷 Upload Foto</Text>
            </TouchableOpacity>

            {selected?.photo && (
              <Image source={{ uri: selected.photo }} style={styles.preview} />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={updateTask}>
              <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================== STYLE ================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#6366f1',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginVertical: 6,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 8,
  },
  edit: { color: '#2563eb' },
  delete: { color: '#dc2626' },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    width: '85%',
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  imageBtn: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});
