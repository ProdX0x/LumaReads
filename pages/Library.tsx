
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLibrary } from '../contexts/LibraryContext';
import { Book } from '../types';

interface SwipeableListItemProps {
  book: Book;
  getStatusLabel: (s: string) => string;
  onRemove: (id: string) => void;
}

// Swipeable List Item Component
const SwipeableListItem: React.FC<SwipeableListItemProps> = ({ book, getStatusLabel, onRemove }) => {
    const navigate = useNavigate();
    const [offset, setOffset] = useState(0);
    const startX = useRef(0);
    const isSwiping = useRef(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        isSwiping.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;

        // If swiping left
        if (diff < -10) {
            isSwiping.current = true;
            // Cap the swipe at -80px with some resistance
            const newOffset = Math.max(diff, -100);
            setOffset(newOffset);
        } else if (offset < 0 && diff > 0) {
            // Swiping right to close
            isSwiping.current = true;
            setOffset(Math.min(0, offset + diff));
        }
    };

    const handleTouchEnd = () => {
        // Snap threshold
        if (offset < -50) {
            setOffset(-80); // Snap Open
        } else {
            setOffset(0); // Snap Closed
        }
    };

    const handleClick = () => {
        // If open or was swiping, prevent navigation and close
        if (offset !== 0 || isSwiping.current) {
            setOffset(0);
            return;
        }
        navigate(`/details/${book.id}`);
    };

    return (
        <div className="relative overflow-hidden rounded-xl h-[106px] shrink-0">
             {/* Background Action Layer */}
            <div className="absolute inset-0 bg-red-500/10 flex items-center justify-end rounded-xl">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(book.id);
                    }}
                    className="h-full w-20 flex flex-col items-center justify-center bg-red-600 text-white active:bg-red-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl mb-1">delete</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">Delete</span>
                </button>
            </div>

            {/* Foreground Content Layer */}
            <div 
                className="relative h-full w-full bg-[#182620] border border-white/5 rounded-xl shadow-sm z-10 transition-transform duration-200 ease-out flex items-center touch-pan-y"
                style={{ transform: `translateX(${offset}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
            >
                <div className="flex flex-row gap-4 p-3 w-full items-center">
                    <div className="relative overflow-hidden rounded-lg w-16 aspect-[2/3] shrink-0 shadow-md">
                        <img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="h-full w-full object-cover"
                        />
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                        <h3 className="text-base font-bold leading-tight text-text-dark font-display truncate">{book.title}</h3>
                        <p className="text-sm text-text-subtle-dark mt-1 truncate">{book.author}</p>
                        <div className={`mt-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-fit ${
                            book.status === 'Reading' ? 'bg-primary text-black' : 'bg-secondary/40 text-primary border border-primary/20'
                        }`}>
                            {getStatusLabel(book.status)}
                        </div>
                    </div>
                    
                    <span className="material-symbols-outlined text-text-subtle-dark">chevron_right</span>
                </div>
            </div>
        </div>
    );
};


const Library: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [view, setView] = useState<'Grid' | 'List'>('Grid');
  const { t } = useLanguage();
  const { books, removeBook } = useLibrary();

  const filteredBooks = filter === 'All' 
    ? books 
    : books.filter(b => b.status === filter);

  // Helper to get translated status label
  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'Read': return t('lib.filter.read');
          case 'Reading': return t('lib.filter.reading');
          case 'To Read': return t('lib.filter.toread');
          default: return status;
      }
  };

  const filterTabs = [
      { id: 'All', label: t('lib.filter.all') },
      { id: 'Read', label: t('lib.filter.read') },
      { id: 'Reading', label: t('lib.filter.reading') },
      { id: 'To Read', label: t('lib.filter.toread') }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center p-4">
          <div className="flex size-12 shrink-0 items-center justify-start">
             {/* Placeholder */}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex-1 text-center text-text-dark">{t('lib.title')}</h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-dark hover:bg-white/5">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4">
        {/* Filter and View Toggle */}
        <div className="flex items-center justify-between gap-4 py-4 sticky top-[72px] z-10 bg-background-dark/95 backdrop-blur-xl -mx-4 px-4 border-b border-white/5 shadow-lg shadow-black/20">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filterTabs.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex h-8 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-secondary/40 text-primary border border-primary/30'
                    : 'bg-white/5 text-text-subtle-dark border border-transparent hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          <div className="flex h-8 shrink-0 items-center rounded-full bg-white/10 p-1">
            <button
              onClick={() => setView('Grid')}
              className={`flex h-full w-8 items-center justify-center rounded-full transition-all ${
                view === 'Grid' ? 'bg-background-dark shadow-sm text-primary' : 'text-text-subtle-dark'
              }`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setView('List')}
              className={`flex h-full w-8 items-center justify-center rounded-full transition-all ${
                view === 'List' ? 'bg-background-dark shadow-sm text-primary' : 'text-text-subtle-dark'
              }`}
            >
              <span className="material-symbols-outlined text-lg">list</span>
            </button>
          </div>
        </div>

        {/* Book Grid/List */}
        <div className={`pt-6 pb-24 ${view === 'Grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'flex flex-col gap-4'}`}>
          {filteredBooks.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">library_books</span>
                <p>No books found</p>
            </div>
          ) : (
            filteredBooks.map((book) => (
               view === 'Grid' ? (
                <Link 
                    to={`/details/${book.id}`} 
                    key={book.id} 
                    className="group relative flex flex-col gap-3"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02] w-full aspect-[2/3]">
                    <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="h-full w-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md ${
                        book.status === 'Reading' ? 'bg-primary' : 'bg-secondary/90 text-white'
                    }`}>
                        {getStatusLabel(book.status)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base font-bold leading-tight text-text-dark font-display group-hover:text-primary transition-colors">{book.title}</h3>
                    <p className="text-sm text-text-subtle-dark mt-1">{book.author}</p>
                  </div>
                </Link>
               ) : (
                   <SwipeableListItem 
                      key={book.id} 
                      book={book} 
                      getStatusLabel={getStatusLabel} 
                      onRemove={removeBook}
                   />
               )
            ))
          )}
        </div>
      </main>
      
      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-40">
        <Link to="/scanner" className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">photo_camera</span>
        </Link>
      </div>
    </div>
  );
};

export default Library;
    