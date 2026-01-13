import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="about" />
      <Tabs.Screen name="users"
  options={{ title: 'Users' }}
/>
<Tabs.Screen name="tasks"
  options={{ title: 'Tasks' }}
/>
<Tabs.Screen name="khs" />

    </Tabs>
  );
}
