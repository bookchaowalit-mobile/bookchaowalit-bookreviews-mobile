import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Book, getBooks, addBook as addBookStorage, updateBook as updateBookStorage, deleteBook as deleteBookStorage } from './storage';

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  stats: { total: number; reading: number; completed: number; pages: number };
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then(b => { setBooks(b); setLoading(false); });
  }, []);

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    pages: books.reduce((sum, b) => sum + b.currentPage, 0),
  };

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

export const useBooks = () => useContext(BookContext)!;
