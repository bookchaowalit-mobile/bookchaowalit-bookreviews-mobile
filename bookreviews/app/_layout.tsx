import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookProvider } from './lib/BookContext';

export default function RootLayout() {
  return (
    <BookProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1a1a2e' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book/[id]" options={{ headerShown: true, title: 'Book Details', headerStyle: { backgroundColor: '#16213e' }, headerTintColor: '#e94560' }} />
        <Stack.Screen name="add" options={{ headerShown: true, title: 'Add Book', presentation: 'modal', headerStyle: { backgroundColor: '#16213e' }, headerTintColor: '#e94560' }} />
      </Stack>
    </BookProvider>
  );
}
