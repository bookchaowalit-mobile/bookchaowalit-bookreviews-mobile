import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useBooks } from '../lib/BookContext';

export default function StatsScreen() {
  const { books, stats } = useBooks();
  const totalPages = books.reduce((s, b) => s + b.pages, 0);
  const readPages = books.reduce((s, b) => s + b.currentPage, 0);
  const avgRating = books.filter(b => b.rating > 0).length > 0
    ? (books.filter(b => b.rating > 0).reduce((s, b) => s + b.rating, 0) / books.filter(b => b.rating > 0).length).toFixed(1)
    : '—';
  const topAuthors = [...new Set(books.map(b => b.author))].slice(0, 5);
  const byStatus = {
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Reading Stats</Text>
      <View style={styles.grid}>
        <View style={styles.card}><Text style={styles.num}>{stats.total}</Text><Text style={styles.label}>Books</Text></View>
        <View style={styles.card}><Text style={styles.num}>{stats.completed}</Text><Text style={styles.label}>Completed</Text></View>
        <View style={styles.card}><Text style={styles.num}>{readPages.toLocaleString()}</Text><Text style={styles.label}>Pages Read</Text></View>
        <View style={styles.card}><Text style={styles.num}>{totalPages.toLocaleString()}</Text><Text style={styles.label}>Total Pages</Text></View>
        <View style={styles.card}><Text style={styles.num}>{avgRating}</Text><Text style={styles.label}>Avg Rating</Text></View>
        <View style={styles.card}><Text style={styles.num}>{books.filter(b => b.status === 'reading').length}</Text><Text style={styles.label}>Active</Text></View>
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
      {topAuthors.length > 0 && <><Text style={styles.section}>Authors</Text>{topAuthors.map(a => <View key={a} style={styles.authorRow}><Text style={styles.authorName}>{a}</Text><Text style={styles.authorCount}>{books.filter(b => b.author === a).length} books</Text></View>)}</>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 60, paddingHorizontal: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
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
