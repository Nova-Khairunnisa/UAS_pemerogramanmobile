import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

export default function Users() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
}
