
export interface Book {
  id: string;
  title: string;
  author: string;
  year?: string;
  coverUrl: string;
  status: 'Read' | 'Reading' | 'To Read';
  summary?: string;
  philosophy?: string;
  mainIdeas?: string[];
  category?: string;
  // New fields for extended analysis
  influences?: string[];
  historicalContext?: string;
  detailedBio?: string;
  recommendations?: { title: string; author: string }[];
}

export interface Author {
  id: string;
  name: string;
  years: string;
  description: string;
  imageUrl: string;
  books: Book[];
}

export interface ScanRecord {
  id: string;
  bookId: string;
  date: string; // ISO or readable string
  timestamp: number;
}
