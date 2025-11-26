
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BOOKS } from '../constants';
import { askAboutBook, generateDetailedBookAnalysis } from '../services/geminiService';
import { Book } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useLibrary } from '../contexts/LibraryContext';

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { books, addBook, removeBook, isInLibrary, updateBookStatus } = useLibrary();
  
  // Try to find book in Library first (to get updated status), then Location (scanned), then Constants
  const libBook = books.find(b => b.id === id);
  const passedBook = location.state?.book as Book | undefined;
  
  // State for the book data
  const [book, setBook] = useState<Book>(libBook || passedBook || BOOKS.find(b => b.id === id) || BOOKS[0]);
  
  // Update state if ID/Location changes (e.g. clicking a recommendation)
  useEffect(() => {
      const foundInLib = books.find(b => b.id === id);
      const newBook = foundInLib || location.state?.book || BOOKS.find(b => b.id === id);
      if (newBook) {
          setBook(newBook);
          setIsAnalysisComplete(!!newBook.detailedBio);
      }
      // Reset analysis states when switching books
      setAiResponse('');
      setAiQuery('');
  }, [id, location.state, books]);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Deep Dive Analysis
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(!!book.detailedBio);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAiAsk = async () => {
      if(!aiQuery.trim()) return;
      setIsLoading(true);
      const answer = await askAboutBook(book.title, book.author, aiQuery, language);
      setAiResponse(answer);
      setIsLoading(false);
  };

  const handleGenerateAnalysis = async () => {
      setIsGeneratingAnalysis(true);
      try {
          const enrichedBook = await generateDetailedBookAnalysis(book, language);
          setBook(prev => ({ ...prev, ...enrichedBook }));
          setIsAnalysisComplete(true);
          // If it's already in library, update it with new analysis
          if (isInLibrary(book.id)) {
              addBook({ ...book, ...enrichedBook }); 
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingAnalysis(false);
      }
  };

  const handleRecommendationClick = (rec: { title: string; author: string }) => {
      const stubBook: Book = {
          id: `rec-${Date.now()}`, 
          title: rec.title,
          author: rec.author,
          status: 'To Read',
          coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop&ixlib=rb-4.0.3', // Generic texture cover
      };
      
      navigate(`/details/${stubBook.id}`, { state: { book: stubBook } });
      window.scrollTo(0,0);
  };

  const toggleLibraryStatus = () => {
      if (isInLibrary(book.id)) {
          removeBook(book.id);
          setToastMessage(t('detail.toast_removed'));
      } else {
          addBook(book);
          setToastMessage(t('detail.toast_added'));
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleStatusChange = (newStatus: 'To Read' | 'Reading' | 'Read') => {
      updateBookStatus(book.id, newStatus);
      // Local state update is handled by the useEffect watching 'books'
  };

  const isStub = !book.summary;
  const isSaved = isInLibrary(book.id);

  return (
    <div className="relative min-h-screen w-full bg-background-dark pb-20 overflow-x-hidden">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2313ec49' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>

        {/* Top App Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-background-dark/80 p-4 pb-2 backdrop-blur-md border-b border-white/5">
            <button onClick={() => navigate(-1)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-dark hover:bg-white/10">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="flex-1 text-center font-serif-display text-lg font-bold leading-tight tracking-[-0.015em] text-text-dark">Book Details</h2>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-dark hover:bg-white/10">
                <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>

        <main className="relative z-10 flex flex-col gap-6 p-4 pt-4">
            {/* Header Module */}
            <header className="flex flex-col items-center gap-6 text-center">
                <div className="w-48 overflow-hidden rounded-lg shadow-2xl shadow-black/50 ring-1 ring-white/10">
                    <img alt={`Cover of ${book.title}`} className="h-auto w-full object-cover" src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop&ixlib=rb-4.0.3'} />
                </div>
                <div>
                    <h1 className="font-serif-display text-[32px] font-bold leading-tight text-gold">{book.title}</h1>
                    <p className="pt-2 text-lg font-normal leading-normal text-text-dark/80">{book.author}</p>
                </div>
            </header>

             {/* Stub Preview Message */}
             {isStub && (
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-primary/20 text-center animate-pulse">
                    <span className="material-symbols-outlined text-primary text-3xl mb-2">auto_stories</span>
                    <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-1">{t('detail.preview_mode')}</h3>
                    <p className="text-text-subtle-dark text-sm">{t('detail.preview_desc')}</p>
                </div>
            )}

            {/* STATUS SELECTOR (Visible only if saved) */}
            {isSaved && (
                <div className="w-full rounded-xl bg-white/5 p-4 border border-white/10 animate-in slide-in-from-bottom-2 fade-in duration-500">
                    <h3 className="text-xs font-bold text-text-subtle-dark uppercase tracking-wider mb-3 text-center">{t('detail.status_label')}</h3>
                    <div className="flex rounded-lg bg-black/40 p-1">
                        {(['To Read', 'Reading', 'Read'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all duration-200 ${
                                    book.status === status 
                                    ? 'bg-primary text-background-dark shadow-md' 
                                    : 'text-text-subtle-dark hover:text-white'
                                }`}
                            >
                                {t(`lib.filter.${status.toLowerCase().replace(' ', '')}`)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Book Category Tag (Only show if NOT saved, otherwise Status takes precedence visually, or move it down) */}
            {!isSaved && book.category && (
                <div className="flex justify-center">
                    <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-teal/20 px-6 ring-1 ring-inset ring-teal/50 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>psychology</span>
                        <p className="text-sm font-medium leading-normal text-primary">{book.category}</p>
                    </div>
                </div>
            )}

            {/* Deep Analysis / Generate Button */}
            {!isAnalysisComplete && (
                <div className="flex justify-center w-full">
                    <button 
                        onClick={handleGenerateAnalysis}
                        disabled={isGeneratingAnalysis}
                        className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-r p-[1px] shadow-lg disabled:opacity-50 ${isStub ? 'from-primary/50 via-white/50 to-primary/50 animate-shimmer' : 'from-gold/20 via-primary/20 to-gold/20'}`}
                    >
                        <div className={`relative flex items-center justify-center gap-2 rounded-xl bg-background-dark/90 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-background-dark/80`}>
                            {isGeneratingAnalysis ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-gold">sync</span>
                                    <span className="font-bold text-gold">{isStub ? t('detail.generating_basic') : t('detail.generating')}</span>
                                </>
                            ) : (
                                <>
                                    <span className={`material-symbols-outlined ${isStub ? 'text-primary' : 'text-gold'}`}>auto_awesome</span>
                                    <span className={`font-bold ${isStub ? 'text-primary' : 'text-gold'}`}>{isStub ? t('detail.generate_basic') : t('detail.generate_full')}</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            )}

            {/* AI Assistant Button (Only show if we have basic info) */}
            {!isStub && (
                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsAiModalOpen(true)}
                        className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-primary/40 hover:bg-white/10 transition-all group"
                    >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">chat_bubble</span>
                        <span className="text-sm font-bold text-text-dark">{t('detail.ask_ai')}</span>
                    </button>
                </div>
            )}

            {/* Accordion Sections */}
            <div className="flex flex-col gap-3 mt-2">
                {/* Summary Section */}
                {book.summary && (
                    <details className="group overflow-hidden rounded-xl border border-primary/20 bg-background-dark/40 shadow-lg backdrop-blur-md transition-all open:bg-background-dark/60" open>
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gold">auto_stories</span>
                                <h3 className="font-serif-display text-lg font-bold text-text-dark">{t('detail.summary')}</h3>
                            </div>
                            <span className="material-symbols-outlined text-text-dark transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="border-t border-primary/20 p-5 pt-2">
                            <p className="text-base leading-relaxed text-gray-300 font-serif-display">{book.summary}</p>
                        </div>
                    </details>
                )}

                 {/* Influences & Context (Deep Analysis) */}
                 {(book.influences || book.historicalContext) && (
                    <details className="group overflow-hidden rounded-xl border border-gold/40 bg-background-dark/40 shadow-lg backdrop-blur-md transition-all open:bg-background-dark/60" open>
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gold">history_edu</span>
                                <h3 className="font-serif-display text-lg font-bold text-text-dark">{t('detail.influences')}</h3>
                            </div>
                            <span className="material-symbols-outlined text-text-dark transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="border-t border-gold/40 p-5 pt-2 flex flex-col gap-4">
                            {book.historicalContext && (
                                <div>
                                    <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-1">Context</h4>
                                    <p className="text-base leading-relaxed text-gray-300 font-serif-display">{book.historicalContext}</p>
                                </div>
                            )}
                            {book.detailedBio && (
                                <div>
                                    <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-1">Author Profile</h4>
                                    <p className="text-base leading-relaxed text-gray-300 font-serif-display">{book.detailedBio}</p>
                                </div>
                            )}
                            {book.influences && (
                                <div>
                                    <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Key Influences</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {book.influences.map((inf, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm border border-gold/20">{inf}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </details>
                )}

                {/* Core Philosophy Section */}
                {book.philosophy && (
                    <details className="group overflow-hidden rounded-xl border border-primary/20 bg-background-dark/40 shadow-lg backdrop-blur-md transition-all open:bg-background-dark/60">
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gold">spa</span>
                                <h3 className="font-serif-display text-lg font-bold text-text-dark">{t('detail.philosophy')}</h3>
                            </div>
                            <span className="material-symbols-outlined text-text-dark transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="border-t border-primary/20 p-5 pt-2">
                            <p className="text-base leading-relaxed text-gray-300 font-serif-display">{book.philosophy}</p>
                        </div>
                    </details>
                )}

                 {/* Main Ideas Section */}
                 {book.mainIdeas && (
                    <details className="group overflow-hidden rounded-xl border border-primary/20 bg-background-dark/40 shadow-lg backdrop-blur-md transition-all open:bg-background-dark/60">
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gold">checklist</span>
                                <h3 className="font-serif-display text-lg font-bold text-text-dark">{t('detail.ideas')}</h3>
                            </div>
                            <span className="material-symbols-outlined text-text-dark transition-transform duration-300 group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="border-t border-primary/20 p-5 pt-2">
                             <ul className="space-y-4">
                                {book.mainIdeas.map((idea, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined mt-0.5 text-primary text-lg">eco</span>
                                        <span className="flex-1 text-base text-gray-300 font-serif-display">{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </details>
                )}
            </div>

            {/* Recommendations Section */}
            {book.recommendations && book.recommendations.length > 0 && (
                <div className="mt-4">
                     <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="material-symbols-outlined text-teal text-xl">recommend</span>
                        <h3 className="font-serif-display text-lg font-bold text-text-dark">{t('detail.related')}</h3>
                     </div>
                     <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                         {book.recommendations.map((rec, idx) => (
                             <button 
                                key={idx} 
                                onClick={() => handleRecommendationClick(rec)}
                                className="min-w-[140px] p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col justify-between h-32 text-left group"
                             >
                                 <div>
                                     <h4 className="font-bold text-sm text-text-dark line-clamp-2 group-hover:text-primary transition-colors">{rec.title}</h4>
                                     <p className="text-xs text-text-subtle-dark mt-1">{rec.author}</p>
                                 </div>
                                 <div className="self-end text-primary text-xs font-bold uppercase tracking-wider flex items-center">
                                     View <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                                 </div>
                             </button>
                         ))}
                     </div>
                </div>
            )}
            
            <div className="h-24"></div>
        </main>

        {/* Floating Action Button - Toggle Library */}
        <div className="fixed bottom-24 right-6 z-20">
            <button 
                onClick={toggleLibraryStatus}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                    isSaved 
                        ? 'bg-secondary text-white border border-primary/30' 
                        : 'bg-primary text-background-dark shadow-primary/30'
                }`}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                    {isSaved ? 'bookmark_added' : 'bookmark_add'}
                </span>
            </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
             <div className="fixed bottom-44 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="bg-[#1a2e22] text-white px-4 py-2 rounded-lg shadow-2xl border border-primary/20 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                        {isSaved ? 'check_circle' : 'delete'}
                    </span>
                    <span className="font-medium text-sm">{toastMessage}</span>
                </div>
            </div>
        )}

        {/* AI Modal */}
        {isAiModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="w-full max-w-md bg-[#1a2e22] border border-primary/30 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                             <span className="material-symbols-outlined">auto_awesome</span>
                             {t('detail.ask_ai')}
                        </h3>
                        <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div className="min-h-[100px] max-h-[300px] overflow-y-auto bg-black/20 rounded-lg p-4 text-gray-200 border border-white/5">
                        {aiResponse ? (
                            <p className="leading-relaxed">{aiResponse}</p>
                        ) : isLoading ? (
                            <div className="flex items-center gap-2 text-primary/70 animate-pulse">
                                <span className="material-symbols-outlined animate-spin">sync</span>
                                {t('detail.thinking')}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">{t('detail.empty_ai')} "{book.title}"...</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder={t('detail.ask_placeholder')}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                            onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                        />
                        <button 
                            onClick={handleAiAsk}
                            disabled={isLoading}
                            className="bg-primary text-background-dark px-4 py-2 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default BookDetails;
