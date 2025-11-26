
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from '../types';
import { BOOKS } from '../constants';

interface LibraryContextType {
  books: Book[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  isInLibrary: (bookId: string) => boolean;
  updateBookStatus: (bookId: string, status: 'Read' | 'Reading' | 'To Read') => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with empty array first to avoid hydration mismatch if SSR (though not applicable here)
  // We will load from local storage in an effect.
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('luma-library');
    if (savedLibrary) {
      try {
        setBooks(JSON.parse(savedLibrary));
      } catch (e) {
        console.error("Failed to parse library", e);
        setBooks(BOOKS); // Fallback to constants
      }
    } else {
      setBooks(BOOKS); // Default starter pack
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever books change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('luma-library', JSON.stringify(books));
    }
  }, [books, isLoaded]);

  const addBook = (book: Book) => {
    setBooks(prev => {
      if (prev.some(b => b.id === book.id)) return prev;
      return [book, ...prev];
    });
  };

  const removeBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const isInLibrary = (bookId: string) => {
    return books.some(b => b.id === bookId);
  };

  const updateBookStatus = (bookId: string, status: 'Read' | 'Reading' | 'To Read') => {
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, status } : b
    ));
  };

  return (
    <LibraryContext.Provider value={{ books, addBook, removeBook, isInLibrary, updateBookStatus }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
