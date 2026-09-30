import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { computeStats, type LibraryStats } from './books';
import { Book, getBooks, addBook as addBookStorage, updateBook as updateBookStorage, deleteBook as deleteBookStorage } from './storage';

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  stats: LibraryStats;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => computeStats(books), [books]);

  // Writes refuse to overwrite an unreadable saved library; tell the user
  // instead of failing silently.
  const guarded = async (write: () => Promise<Book[]>) => {
    try {
      setBooks(await write());
    } catch (e) {
      Alert.alert('Library not saved', e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <BookContext.Provider value={{
      books, loading, stats,
      addBook: (book) => guarded(() => addBookStorage(book)),
      updateBook: (id, updates) => guarded(() => updateBookStorage(id, updates)),
      deleteBook: (id) => guarded(() => deleteBookStorage(id)),
    }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks(): BookContextType {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks must be used inside <BookProvider>');
  return ctx;
}
