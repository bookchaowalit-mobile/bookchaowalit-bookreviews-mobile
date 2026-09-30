import { describe, expect, it } from 'vitest';
import { exportLibrary, MAX_NOTES_LENGTH, normalizeNotes, parseStoredBooks } from './books';

const book = {
  id: 'b1', title: 'Dune', author: 'Herbert', status: 'reading', rating: 4,
  pages: 400, currentPage: 10, notes: 'Great world-building', coverColor: '#000', dateAdded: '2025-01-01T00:00:00.000Z',
};

describe('notes', () => {
  it('normalizeNotes trims trailing whitespace and caps length', () => {
    expect(normalizeNotes('hello \n\n')).toBe('hello');
    expect(normalizeNotes('x'.repeat(MAX_NOTES_LENGTH + 50))).toHaveLength(MAX_NOTES_LENGTH);
  });

  it('parseStoredBooks keeps notes and back-fills missing ones', () => {
    const { notes: _drop, ...legacy } = book;
    const parsed = parseStoredBooks(JSON.stringify([book, { ...legacy, id: 'b2' }]));
    expect(parsed.map((b) => b.notes)).toEqual(['Great world-building', '']);
  });
});

describe('exportLibrary', () => {
  it('produces a versioned backup that round-trips the books', () => {
    const json = exportLibrary(parseStoredBooks(JSON.stringify([book])), new Date('2026-01-02T03:04:05Z'));
    const data = JSON.parse(json);
    expect(data).toMatchObject({ app: 'bookreviews', version: 1, exportedAt: '2026-01-02T03:04:05.000Z' });
    expect(parseStoredBooks(JSON.stringify(data.books))).toHaveLength(1);
  });
});
