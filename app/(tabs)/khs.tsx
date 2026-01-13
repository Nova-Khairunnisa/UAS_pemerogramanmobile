import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../config/firebase';

type Matkul = {
  nama: string;
  nilai: string;
};

type Semester = {
  ip: number;
  matakuliah: Matkul[];
};

export default function KHS() {
  const [data, setData] = useState<Record<string, Semester>>({});

  useEffect(() => {
    const khsRef = ref(db, 'khs');

    // 🔥 REALTIME LISTENER
    const unsub = onValue(khsRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    });

    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Kartu Hasil Studi</Text>

      <FlatList
        data={Object.entries(data)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [semester, value] = item;

          return (
            <View style={styles.card}>
              <Text style={styles.semester}>
                {semester.toUpperCase()}
              </Text>

              {value.matakuliah.map((m, i) => (
                <View key={i} style={styles.row}>
                  <Text>{m.nama}</Text>
                  <Text style={styles.nilai}>{m.nilai}</Text>
                </View>
              ))}

              <Text style={styles.ip}>IP Semester: {value.ip}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 5,
  },
  semester: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#4f46e5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nilai: {
    fontWeight: '700',
  },
  ip: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});
