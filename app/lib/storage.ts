import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = '@bookeverything:books';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'want-to-read';
  rating: number;
  pages: number;
  currentPage: number;
  notes: string;
  coverColor: string;
  dateAdded: string;
  dateCompleted?: string;
}

const COLORS = ['#e94560', '#0f3460', '#533483', '#16213e', '#e76f51', '#2a9d8f', '#e9c46a', '#264653'];

export async function getBooks(): Promise<Book[]> {
  const json = await AsyncStorage.getItem(BOOKS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveBooks(books: Book[]): Promise<void> {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export async function addBook(book: Omit<Book, 'id' | 'dateAdded' | 'coverColor'>): Promise<Book[]> {
  const books = await getBooks();
  const newBook: Book = {
    ...book,
    id: Date.now().toString(),
    coverColor: COLORS[books.length % COLORS.length],
    dateAdded: new Date().toISOString(),
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
