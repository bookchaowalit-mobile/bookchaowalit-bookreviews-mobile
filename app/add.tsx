import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooks } from './lib/BookContext';

export default function AddBookScreen() {
  const router = useRouter();
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [status, setStatus] = useState<'reading' | 'completed' | 'want-to-read'>('want-to-read');
  const [rating, setRating] = useState(0);

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Missing Info', 'Please enter at least a title and author.');
      return;
    }
    await addBook({ title: title.trim(), author: author.trim(), pages: parseInt(pages) || 0, currentPage: status === 'completed' ? (parseInt(pages) || 0) : 0, status, rating, notes: '' });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Book title" placeholderTextColor="#555" />
      <Text style={styles.label}>Author *</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Author name" placeholderTextColor="#555" />
      <Text style={styles.label}>Pages</Text>
      <TextInput style={styles.input} value={pages} onChangeText={setPages} placeholder="Number of pages" placeholderTextColor="#555" keyboardType="number-pad" />
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {(['want-to-read', 'reading', 'completed'] as const).map(s => (
          <TouchableOpacity key={s} style={[styles.statusBtn, status === s && styles.statusBtnActive]} onPress={() => setStatus(s)}>
            <Text style={[styles.statusBtnText, status === s && styles.statusBtnTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {status !== 'want-to-read' && <><Text style={styles.label}>Rating</Text><View style={styles.ratingRow}>{[1,2,3,4,5].map(n => <TouchableOpacity key={n} onPress={() => setRating(n)}><Text style={[styles.star, n <= rating && styles.starActive]}>★</Text></TouchableOpacity>)}</View></>}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Add Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 20, paddingHorizontal: 20 },
  label: { color: '#888', fontSize: 14, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: '#16213e', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusBtn: { flex: 1, backgroundColor: '#16213e', borderRadius: 10, padding: 12, alignItems: 'center' },
  statusBtnActive: { backgroundColor: '#e94560' },
  statusBtnText: { color: '#888', fontSize: 13 },
  statusBtnTextActive: { color: '#fff', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 32, color: '#333' },
  starActive: { color: '#e9c46a' },
  saveBtn: { backgroundColor: '#e94560', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 32 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
