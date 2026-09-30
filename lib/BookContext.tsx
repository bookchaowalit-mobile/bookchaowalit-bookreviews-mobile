import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
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

  return (
    <BookContext.Provider value={{
      books, loading, stats,
      addBook: async (book) => setBooks(await addBookStorage(book)),
      updateBook: async (id, updates) => setBooks(await updateBookStorage(id, updates)),
      deleteBook: async (id) => setBooks(await deleteBookStorage(id)),
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
