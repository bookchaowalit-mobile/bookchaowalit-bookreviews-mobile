import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#e94560',
      tabBarInactiveTintColor: '#888',
      tabBarStyle: { backgroundColor: '#16213e', borderTopColor: '#0f3460' },
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name="index" options={{ title: 'Library', tabBarIcon: ({ color, size }) => <Ionicons name="books" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}
