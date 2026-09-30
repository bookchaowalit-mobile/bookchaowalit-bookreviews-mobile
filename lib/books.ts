/** Pure, storage-independent book logic (unit-tested in lib/books.test.ts). */

export type BookStatus = 'reading' | 'completed' | 'want-to-read';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  rating: number;
  pages: number;
  currentPage: number;
  notes: string;
  coverColor: string;
  dateAdded: string;
  dateCompleted?: string;
}

export const STATUSES: BookStatus[] = ['want-to-read', 'reading', 'completed'];

/** Reading progress 0-100; 0 when the page count is unknown (avoids NaN/Infinity). */
export function progressPercent(book: Pick<Book, 'pages' | 'currentPage'>): number {
  if (!(book.pages > 0)) return 0;
  return Math.round((Math.min(Math.max(book.currentPage, 0), book.pages) / book.pages) * 100);
}

/**
 * Move the current page by `delta`, clamped to [0, pages]. Reaching the last
 * page marks the book completed; moving back from the end resumes reading.
 */
export function applyPageDelta(book: Book, delta: number): Pick<Book, 'currentPage' | 'status'> {
  const currentPage = Math.max(0, Math.min(book.pages, book.currentPage + delta));
  let status = book.status;
  if (book.pages > 0 && currentPage >= book.pages) status = 'completed';
  else if (book.status === 'completed' && currentPage < book.pages) status = 'reading';
  return { currentPage, status };
}

/** Parse a page count typed by the user: blank = 0, otherwise a whole number 0-100000. */
export function parsePages(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return n <= 100000 ? n : null;
}

export type NewBookInput = { title: string; author: string; pages: string; status: BookStatus; rating: number };

export function validateNewBook(input: NewBookInput): string | null {
  if (!input.title.trim() || !input.author.trim()) return 'Please enter at least a title and author.';
  if (parsePages(input.pages) === null) return 'Pages must be a whole number (0-100000).';
  if (!Number.isInteger(input.rating) || input.rating < 0 || input.rating > 5) return 'Rating must be 0-5 stars.';
  return null;
}

/** Build the fields for a new book from validated form input. */
export function toNewBook(input: NewBookInput): Omit<Book, 'id' | 'dateAdded' | 'coverColor'> {
  const pages = parsePages(input.pages) ?? 0;
  return {
    title: input.title.trim(),
    author: input.author.trim(),
    pages,
    currentPage: input.status === 'completed' ? pages : 0,
    status: input.status,
    // Only books you have started or finished can be rated.
    rating: input.status === 'want-to-read' ? 0 : input.rating,
    notes: '',
  };
}

export type LibraryStats = {
  total: number;
  reading: number;
  completed: number;
  wantToRead: number;
  pagesRead: number;
  totalPages: number;
  averageRating: number | null;
  topAuthors: { author: string; count: number }[];
};

export function computeStats(books: Book[]): LibraryStats {
  const rated = books.filter((b) => b.rating > 0);
  const authorCounts = new Map<string, number>();
  for (const b of books) authorCounts.set(b.author, (authorCounts.get(b.author) ?? 0) + 1);
  return {
    total: books.length,
    reading: books.filter((b) => b.status === 'reading').length,
    completed: books.filter((b) => b.status === 'completed').length,
    wantToRead: books.filter((b) => b.status === 'want-to-read').length,
    pagesRead: books.reduce((s, b) => s + Math.max(0, Math.min(b.currentPage, b.pages || b.currentPage)), 0),
    totalPages: books.reduce((s, b) => s + Math.max(0, b.pages), 0),
    averageRating: rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : null,
    topAuthors: [...authorCounts.entries()]
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author))
      .slice(0, 5),
  };
}

function isBook(value: unknown): value is Book {
  if (!value || typeof value !== 'object') return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.title === 'string' &&
    typeof b.author === 'string' &&
    STATUSES.includes(b.status as BookStatus) &&
    typeof b.pages === 'number' &&
    typeof b.currentPage === 'number' &&
    typeof b.rating === 'number'
  );
}

/** Parse persisted JSON defensively: corrupt or foreign data yields [] instead of crashing the app. */
export function parseStoredBooks(json: string | null): Book[] {
  if (!json) return [];
  try {
    const data: unknown = JSON.parse(json);
    return Array.isArray(data)
      ? data.filter(isBook).map((b) => ({ ...b, notes: typeof b.notes === 'string' ? b.notes : '' }))
      : [];

  } catch {
    return [];
  }
}

export type StatusFilter = BookStatus | 'all';

/** Filter by status and a case-insensitive title/author query. */
export function filterBooks(books: Book[], status: StatusFilter, query = ''): Book[] {
  const q = query.trim().toLowerCase();
  return books.filter(
    (b) =>
      (status === 'all' || b.status === status) &&
      (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
  );
}

export const MAX_NOTES_LENGTH = 2000;

/** Trims trailing whitespace and caps notes so one book cannot bloat storage. */
export function normalizeNotes(text: string): string {
  return text.replace(/\s+$/, '').slice(0, MAX_NOTES_LENGTH);
}

/** Portable JSON backup of the library (AsyncStorage is device-only). */
export function exportLibrary(books: Book[], now: Date): string {
  return JSON.stringify({ app: 'bookreviews', version: 1, exportedAt: now.toISOString(), books }, null, 2);
}
