import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseStoredBooks, type Book } from './books';

export type { Book } from './books';

const BOOKS_KEY = '@bookeverything:books';

const COLORS = ['#e94560', '#0f3460', '#533483', '#16213e', '#e76f51', '#2a9d8f', '#e9c46a', '#264653'];

export async function getBooks(): Promise<Book[]> {
  return parseStoredBooks(await AsyncStorage.getItem(BOOKS_KEY));
}

export async function saveBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export async function addBook(book: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>): Promise<Book[]> {
  const books = await getBooks();
  const newBook: Book = {
    ...book,
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    coverColor: COLORS[books.length % COLORS.length],
    dateAdded: new Date().toISOString(),
    ...(book.status === 'completed' ? { dateCompleted: new Date().toISOString() } : {}),
  };
  books.unshift(newBook);
  await saveBooks(books);
  return books;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book[]> {
  const books = await getBooks();
  const idx = books.findIndex(b => b.id === id);
  if (idx >= 0) {
    books[idx] = { ...books[idx], ...updates };
    if (updates.status === 'completed' && !books[idx].dateCompleted) {
      books[idx].dateCompleted = new Date().toISOString();
    }
  }
  await saveBooks(books);
  return books;
}

export async function deleteBook(id: string): Promise<Book[]> {
  const books = (await getBooks()).filter(b => b.id !== id);
  await saveBooks(books);
  return books;
}
