import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBooks } from '../../lib/BookContext';
import {
  applyPageDelta,
  coverInitial,
  MAX_NOTES_LENGTH,
  normalizeNotes,
  progressPercent,
  STATUSES,
  type BookStatus,
} from '../../lib/books';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { books, updateBook, deleteBook } = useBooks();
  const book = books.find(b => b.id === id);
  const savedNotes = book?.notes ?? '';
  const [notes, setNotes] = useState(savedNotes);
  useEffect(() => setNotes(savedNotes), [savedNotes]);
  const notesDirty = normalizeNotes(notes) !== savedNotes;

  if (!book) return <View style={styles.center}><Text style={styles.text}>Book not found</Text></View>;

  const progress = progressPercent(book);

  const handleDelete = () => {
    Alert.alert('Delete Book', `Remove "${book.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteBook(book.id); router.back(); } },
    ]);
  };

  const updateProgress = (delta: number) => {
    updateBook(book.id, applyPageDelta(book, delta));
  };

  const setStatus = (status: BookStatus) => {
    const currentPage = status === 'completed' ? book.pages : status === 'want-to-read' ? 0 : book.currentPage;
    updateBook(book.id, { status, currentPage, ...(status === 'want-to-read' ? { rating: 0 } : {}) });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
        <Text style={styles.coverLetter}>{coverInitial(book.title)}</Text>
        <Text style={styles.coverTitle}>{book.title}</Text>
      </View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <View style={styles.statusRow} accessibilityRole="radiogroup">
        {STATUSES.map(s => (
          <TouchableOpacity key={s} style={[styles.statusBtn, book.status === s && styles.statusBtnActive]} onPress={() => setStatus(s)} accessibilityRole="radio" accessibilityState={{ selected: book.status === s }}>
            <Text style={[styles.statusBtnText, book.status === s && styles.statusBtnTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {book.status === 'reading' && book.pages > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}><Text style={styles.progressLabel}>Progress</Text><Text style={styles.progressPct}>{progress}%</Text></View>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
          <View style={styles.progressBtns}>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(-10)} accessibilityLabel="Back 10 pages"><Text style={styles.pageBtnText}>-10</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(10)} accessibilityLabel="Forward 10 pages"><Text style={styles.pageBtnText}>+10</Text></TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} onPress={() => updateProgress(50)} accessibilityLabel="Forward 50 pages"><Text style={styles.pageBtnText}>+50</Text></TouchableOpacity>
          </View>
          <Text style={styles.pageCount}>{book.currentPage} / {book.pages} pages</Text>
        </View>
      )}
      {book.status !== 'want-to-read' && (
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => updateBook(book.id, { rating: n === book.rating ? 0 : n })} accessibilityRole="button" accessibilityLabel={`Rate ${n} of 5`} accessibilityState={{ selected: n <= book.rating }}>
              <Text style={[styles.rating, n > book.rating && styles.ratingOff]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.notesLabel} nativeID="notesLabel">Notes</Text>
      <TextInput
        style={styles.notesInput}
        multiline
        value={notes}
        onChangeText={setNotes}
        onBlur={() => { if (notesDirty) updateBook(book.id, { notes: normalizeNotes(notes) }); }}
        maxLength={MAX_NOTES_LENGTH}
        placeholder="Thoughts, quotes, review draft…"
        placeholderTextColor="#777"
        accessibilityLabel={`Notes for ${book.title}`}
        accessibilityLabelledBy="notesLabel"
      />
      <View style={styles.notesFooter}>
        <Text style={styles.pageCount}>{notes.length}/{MAX_NOTES_LENGTH}</Text>
        <TouchableOpacity
          onPress={() => updateBook(book.id, { notes: normalizeNotes(notes) })}
          disabled={!notesDirty}
          accessibilityRole="button"
          accessibilityLabel="Save notes"
          accessibilityState={{ disabled: !notesDirty }}
        >
          <Text style={[styles.saveNotes, !notesDirty && styles.saveNotesDone]} accessibilityLiveRegion="polite">
            {notesDirty ? 'Save notes' : 'Saved'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} accessibilityRole="button" accessibilityLabel={`Remove ${book.title} from library`}>
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
  rating: { color: '#e9c46a', fontSize: 28 },
  ratingOff: { color: '#333' },
  ratingRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statusBtn: { flex: 1, backgroundColor: '#16213e', borderRadius: 10, padding: 10, alignItems: 'center' },
  statusBtnActive: { backgroundColor: '#e94560' },
  statusBtnText: { color: '#888', fontSize: 13 },
  statusBtnTextActive: { color: '#fff', fontWeight: '600' },
  notesLabel: { color: '#aaa', fontSize: 14, marginTop: 24, marginBottom: 6 },
  notesInput: { backgroundColor: '#16213e', color: '#fff', borderRadius: 12, padding: 12, minHeight: 110, textAlignVertical: 'top', fontSize: 15 },
  notesFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  saveNotes: { color: '#2a9d8f', fontWeight: '600', padding: 6 },
  saveNotesDone: { color: '#888' },
  deleteBtn: { marginTop: 32, padding: 14, alignItems: 'center' },

  deleteText: { color: '#e94560', fontSize: 16 },
});
