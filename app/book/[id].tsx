import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooks } from '../lib/BookContext';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, updateBook, deleteBook } = useBooks();
  const book = books.find(b => b.id === id);

  if (!book) return <View style={styles.center}><Text style={styles.text}>Book not found</Text></View>;

  const progress = book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;

  const handleDelete = () => {
    Alert.alert('Delete Book', `Remove "${book.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteBook(book.id); router.back(); } },
    ]);
  };

  const updateProgress = (delta: number) => {
    const newPage = Math.max(0, Math.min(book.pages, book.currentPage + delta));
    updateBook(book.id, { currentPage: newPage, status: newPage >= book.pages ? 'completed' : book.status });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
        <Text style={styles.coverLetter}>{book.title.charAt(0)}</Text>
        <Text style={styles.coverTitle}>{book.title}</Text>
      </View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <View style={[styles.badge, { backgroundColor: book.status === 'reading' ? '#2a9d8f30' : book.status === 'completed' ? '#e9c46a30' : '#e76f5130' }]}>
        <Text style={[styles.badgeText, { color: book.status === 'reading' ? '#2a9d8f' : book.status === 'completed' ? '#e9c46a' : '#e76f51' }]}>{book.status}</Text>
      </View>
      {book.status === 'reading' && book.pages > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}><Text style={styles.progressLabel}>Progress</Text><Text style={styles.progressPct}>{progress}%</Text></View>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
          <View style={styles.progressBtns}>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(-10)}><Text style={styles.pageBtnText}>-10</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(10)}><Text style={styles.pageBtnText}>+10</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(50)}><Text style={styles.pageBtnText}>+50</Text></TouchableOpacity>
          </View>
          <Text style={styles.pageCount}>{book.currentPage} / {book.pages} pages</Text>
        </View>
      )}
      {book.rating > 0 && <Text style={styles.rating}>{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</Text>}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteText}>Remove Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingHorizontal: 20, paddingTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  text: { color: '#fff' },
  cover: { width: '100%', height: 200, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  coverLetter: { color: '#ffffff40', fontSize: 80, fontWeight: 'bold' },
  coverTitle: { color: '#fff', fontSize: 18, fontWeight: '600', position: 'absolute', bottom: 16 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  author: { color: '#888', fontSize: 16, marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 12 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  progressSection: { marginTop: 24, backgroundColor: '#16213e', borderRadius: 16, padding: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: '#888', fontSize: 14 },
  progressPct: { color: '#2a9d8f', fontSize: 18, fontWeight: 'bold' },
  progressBar: { height: 8, backgroundColor: '#0a0a1a', borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#2a9d8f', borderRadius: 4 },
  progressBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  pageBtn: { flex: 1, backgroundColor: '#0f3460', borderRadius: 10, padding: 12, alignItems: 'center' },
  pageBtnText: { color: '#2a9d8f', fontSize: 16, fontWeight: '600' },
  pageCount: { color: '#555', fontSize: 13, textAlign: 'center', marginTop: 8 },
  rating: { color: '#e9c46a', fontSize: 28, marginTop: 16 },
  deleteBtn: { marginTop: 32, padding: 14, alignItems: 'center' },
  deleteText: { color: '#e94560', fontSize: 16 },
});
