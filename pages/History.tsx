import React from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryItem: React.FC<{title: string, author: string, time: string}> = ({title, author, time}) => (
    <div className="flex items-center gap-4 bg-[#1a2e22] hover:bg-[#233d2e] transition-colors px-4 min-h-[80px] py-3 justify-between rounded-xl shadow-sm border border-white/5">
        <div className="flex items-center gap-4 flex-grow min-w-0">
            <div className="text-white flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-14">
                <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
                <p className="text-text-dark text-lg font-display font-medium leading-normal truncate">{title}</p>
                <p className="text-secondary/80 text-sm font-normal leading-normal truncate">{author}</p>
            </div>
        </div>
        <div className="shrink-0"><p className="text-zinc-500 text-sm font-normal">{time}</p></div>
    </div>
);

const History: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark pb-20">
             <header className="flex items-center p-4 pb-2 justify-between bg-background-dark sticky top-0 z-10 border-b border-white/5 backdrop-blur-md bg-background-dark/90">
                <div className="flex size-12 shrink-0 items-center justify-start">
                    <button onClick={() => navigate(-1)} className="text-text-dark hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">arrow_back</span>
                    </button>
                </div>
                <h1 className="text-text-dark text-2xl font-display font-bold leading-tight flex-1 text-center">Scan History</h1>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex items-center justify-center h-12 text-text-dark hover:text-white">
                        <span className="material-symbols-outlined text-3xl">search</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow px-4 py-2">
                <section>
                    <h2 className="text-text-dark/90 text-sm font-bold uppercase tracking-wider pt-6 pb-3 font-body">Today</h2>
                    <div className="flex flex-col gap-3">
                        <HistoryItem title="The Fifth Season" author="N. K. Jemisin" time="3:15 PM" />
                        <HistoryItem title="Project Hail Mary" author="Andy Weir" time="9:42 AM" />
                    </div>
                </section>

                <section className="mt-2">
                    <h2 className="text-text-dark/90 text-sm font-bold uppercase tracking-wider pt-6 pb-3 font-body">Yesterday</h2>
                    <div className="flex flex-col gap-3">
                        <HistoryItem title="Dune" author="Frank Herbert" time="6:20 PM" />
                    </div>
                </section>

                <section className="mt-2">
                    <h2 className="text-text-dark/90 text-sm font-bold uppercase tracking-wider pt-6 pb-3 font-body">October 2024</h2>
                    <div className="flex flex-col gap-3">
                        <HistoryItem title="A Wizard of Earthsea" author="Ursula K. Le Guin" time="Oct 12" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default History;