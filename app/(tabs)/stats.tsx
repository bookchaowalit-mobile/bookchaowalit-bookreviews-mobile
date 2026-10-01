import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity } from 'react-native';
import { useBooks } from '../../lib/BookContext';
import { exportLibrary } from '../../lib/books';

export default function StatsScreen() {
  const { stats, books } = useBooks();
  const backup = () => {
    Share.share({ title: 'Book library backup', message: exportLibrary(books, new Date()) }).catch(() => undefined);
  };
  const avgRating = stats.averageRating === null ? '—' : stats.averageRating.toFixed(1);
  const byStatus = { reading: stats.reading, completed: stats.completed, wantToRead: stats.wantToRead };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Reading Stats</Text>
      <View style={styles.grid}>
        <View style={styles.card}><Text style={styles.num}>{stats.total}</Text><Text style={styles.label}>Books</Text></View>
        <View style={styles.card}><Text style={styles.num}>{stats.completed}</Text><Text style={styles.label}>Completed</Text></View>
        <View style={styles.card}><Text style={styles.num}>{stats.pagesRead.toLocaleString()}</Text><Text style={styles.label}>Pages Read</Text></View>
        <View style={styles.card}><Text style={styles.num}>{stats.totalPages.toLocaleString()}</Text><Text style={styles.label}>Total Pages</Text></View>
        <View style={styles.card}><Text style={styles.num}>{avgRating}</Text><Text style={styles.label}>Avg Rating</Text></View>
        <View style={styles.card}><Text style={styles.num}>{stats.reading}</Text><Text style={styles.label}>Active</Text></View>
      </View>
      <Text style={styles.section}>By Status</Text>
      <View style={styles.barContainer}>
        {(['reading', 'completed', 'wantToRead'] as const).map(key => {
          const pct = stats.total > 0 ? (byStatus[key] / stats.total) * 100 : 0;
          const colors = { reading: '#2a9d8f', completed: '#e9c46a', wantToRead: '#e76f51' };
          const labels = { reading: 'Reading', completed: 'Completed', wantToRead: 'Want to Read' };
          return (
            <View key={key} style={styles.barRow}>
              <Text style={styles.barLabel}>{labels[key]}</Text>
              <View style={styles.barBg}><View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors[key] }]} /></View>
              <Text style={styles.barCount}>{byStatus[key]}</Text>
            </View>
          );
        })}
      </View>
      {stats.topAuthors.length > 0 && <><Text style={styles.section}>Authors</Text>{stats.topAuthors.map(a => <View key={a.author} style={styles.authorRow}><Text style={styles.authorName}>{a.author}</Text><Text style={styles.authorCount}>{a.count} {a.count === 1 ? 'book' : 'books'}</Text></View>)}</>}
      <TouchableOpacity
        style={styles.exportBtn}
        onPress={backup}
        disabled={books.length === 0}
        accessibilityRole="button"
        accessibilityLabel="Export library as JSON backup"
        accessibilityState={{ disabled: books.length === 0 }}
      >
        <Text style={styles.exportText}>Export library (JSON)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 60, paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  exportBtn: { marginTop: 24, backgroundColor: '#0f3460', borderRadius: 12, padding: 14, alignItems: 'center' },
  exportText: { color: '#fff', fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: { width: '47%', backgroundColor: '#16213e', borderRadius: 16, padding: 20, alignItems: 'center' },
  num: { color: '#e94560', fontSize: 32, fontWeight: 'bold' },
  label: { color: '#888', fontSize: 14, marginTop: 4 },
  section: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 12, marginTop: 8 },
  barContainer: { backgroundColor: '#16213e', borderRadius: 16, padding: 16, marginBottom: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barLabel: { color: '#ccc', width: 100, fontSize: 14 },
  barBg: { flex: 1, height: 8, backgroundColor: '#0a0a1a', borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  barFill: { height: 8, borderRadius: 4 },
  barCount: { color: '#888', width: 30, textAlign: 'right', fontSize: 14 },
  authorRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 8 },
  authorName: { color: '#fff', fontSize: 16 },
  authorCount: { color: '#888', fontSize: 14 },
});
