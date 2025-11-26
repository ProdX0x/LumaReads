
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AUTHORS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Filter for the "Exceptional 1500-1950" section
  const classicAuthors = AUTHORS.filter(author => {
      // Very basic parsing for demo purposes
      const startYear = parseInt(author.years.split('-')[0]);
      return startYear >= 1500 && startYear <= 1950;
  });

  const otherAuthors = AUTHORS.filter(author => !classicAuthors.includes(author));

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark pb-20">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-white/5 backdrop-blur-md bg-background-dark/90">
        <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center justify-start text-white hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">{t('rec.title')}</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 text-white/80 hover:text-white">
            <span className="material-symbols-outlined">visibility</span>
          </button>
        </div>
      </div>

      <main className="flex flex-col gap-8 px-4 py-6">
        
        {/* SPECIAL SECTION: THE GOLDEN AGE (1500-1950) */}
        <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-[#1e1915]">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
             <div className="relative p-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-gold text-3xl">auto_awesome</span>
                    <h2 className="text-2xl font-serif-display font-bold text-gold">{t('rec.classic_era')}</h2>
                </div>
                <p className="text-sepia-light text-sm mb-6 text-gray-300 font-serif-display italic">{t('rec.classic_desc')}</p>
                
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
                    {classicAuthors.map((author) => (
                        <div key={author.id} className="min-w-[260px] p-4 bg-black/20 rounded-xl border border-gold/10 hover:border-gold/40 transition-all">
                             <div className="flex items-center gap-4 mb-3">
                                 <div 
                                    className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gold/30" 
                                    style={{backgroundImage: `url('${author.imageUrl}')`}}
                                 ></div>
                                 <div>
                                     <h3 className="text-gold font-bold">{author.name}</h3>
                                     <p className="text-xs text-gray-400">{author.years}</p>
                                 </div>
                             </div>
                             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {author.books.map(book => (
                                    <Link to={`/details/${book.id}`} key={book.id} className="shrink-0 w-16 group">
                                         <div className="w-full aspect-[2/3] rounded bg-cover bg-center mb-1 ring-1 ring-white/10 group-hover:ring-gold/50 transition-all" style={{backgroundImage: `url('${book.coverUrl}')`}}></div>
                                    </Link>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
             </div>
        </section>

        {/* Standard Recommendations */}
        {otherAuthors.map((author) => (
            <div key={author.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/20 transition-all duration-300">
                <div className="flex flex-col items-stretch justify-start rounded-lg md:flex-row md:items-start gap-4">
                    <div 
                        className="w-full md:w-1/3 aspect-video bg-cover bg-center rounded-lg shadow-lg opacity-90 hover:opacity-100 transition-opacity" 
                        style={{backgroundImage: `url('${author.imageUrl}')`}}
                    ></div>
                    
                    <div className="flex w-full grow flex-col items-stretch justify-center gap-2 py-2">
                        <p className="text-primary text-sm font-medium tracking-wide">{author.description}</p>
                        <h3 className="text-white text-xl font-bold font-display">{author.name} <span className="text-white/50 text-base font-normal">({author.years})</span></h3>
                        
                        <div className="flex items-end gap-3 justify-between mt-2">
                            <p className="text-zinc-400 text-sm font-normal leading-relaxed flex-1">
                                Discover {author.books.map(b => b.title).join(', ')}.
                            </p>
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-background-dark text-sm font-bold shadow-lg shadow-primary/20 hover:bg-white hover:text-black transition-all">
                                <span className="truncate">Explore</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Scroll List */}
                <div className="flex overflow-x-auto no-scrollbar mt-6 gap-4 pb-2 mask-linear-fade">
                    {author.books.map((book) => (
                        <Link to={`/details/${book.id}`} key={book.id} className="flex flex-col gap-2 min-w-[120px] w-[120px] group cursor-pointer">
                            <div 
                                className="w-full aspect-[2/3] bg-cover bg-center rounded-lg shadow-md transition-transform group-hover:-translate-y-1"
                                style={{backgroundImage: `url('${book.coverUrl}')`}}
                            ></div>
                            <div>
                                <p className="text-white text-sm font-medium leading-tight truncate group-hover:text-primary transition-colors">{book.title}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">{book.year}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        ))}
      </main>
    </div>
  );
};

export default Recommendations;
