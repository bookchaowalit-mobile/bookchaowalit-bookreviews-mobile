import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooks } from '../lib/BookContext';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS: Record<string, string> = {
  'reading': '#2a9d8f', 'completed': '#e9c46a', 'want-to-read': '#e76f51',
};

export default function LibraryScreen() {
  const { books, loading, stats } = useBooks();
  const router = useRouter();

  if (loading) return <View style={styles.center}><Text style={styles.text}>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statChip}><Text style={styles.statNum}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View>
        <View style={styles.statChip}><Text style={styles.statNum}>{stats.reading}</Text><Text style={styles.statLabel}>Reading</Text></View>
        <View style={styles.statChip}><Text style={styles.statNum}>{stats.completed}</Text><Text style={styles.statLabel}>Done</Text></View>
      </View>
      <FlatList
        data={books}
        keyExtractor={b => b.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookCard} onPress={() => router.push(`/book/${item.id}`)}>
            <View style={[styles.bookCover, { backgroundColor: item.coverColor }]}>
              <Text style={styles.coverTitle}>{item.title.charAt(0)}</Text>
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
              <View style={styles.bookMeta}>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '30' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
                </View>
                {item.status === 'reading' && (
                  <Text style={styles.progress}>{Math.round((item.currentPage / item.pages) * 100)}%</Text>
                )}
                {item.rating > 0 && <Text style={styles.stars}>{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library" size={64} color="#333" />
            <Text style={styles.emptyText}>No books yet.{'\n'}Tap + to add your first book!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 60, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  text: { color: '#fff', fontSize: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#e94560', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statChip: { flex: 1, backgroundColor: '#16213e', borderRadius: 12, padding: 12, alignItems: 'center' },
  statNum: { color: '#e94560', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  bookCard: { flexDirection: 'row', backgroundColor: '#16213e', borderRadius: 16, padding: 16, marginBottom: 12 },
  bookCover: { width: 56, height: 72, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  coverTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bookInfo: { flex: 1 },
  bookTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  bookAuthor: { color: '#888', fontSize: 14, marginTop: 2 },
  bookMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  progress: { color: '#2a9d8f', fontSize: 13, fontWeight: '600' },
  stars: { color: '#e9c46a', fontSize: 13 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#555', fontSize: 16, textAlign: 'center', marginTop: 16 },
});
