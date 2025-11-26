
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { identifyBookFromImage, searchBookByQuery } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // New State for Search Mode
  const [mode, setMode] = useState<'camera' | 'search'>('camera');
  const [searchQuery, setSearchQuery] = useState('');

  const { t, language } = useLanguage();

  // 1. Acquire Stream on Mount (Always keep camera ready for seamless switch, but maybe mute/pause if needed)
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        // Only show error if we are in camera mode
        if (mode === 'camera') setError(t('scan.permission'));
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [t, mode]);

  // 2. Attach Stream to Video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Error attempting to play video:", e));
    }
  }, [stream]);

  const captureImage = (): string | null => {
      if (!videoRef.current) return null;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCapture = async () => {
      if (!stream || isScanning) return;
      
      try {
          setIsScanning(true);
          const base64Full = captureImage();
          
          if (!base64Full) {
              throw new Error("Failed to capture image");
          }
          const base64Data = base64Full.split(',')[1];
          const bookData = await identifyBookFromImage(base64Data, language);

          if (bookData) {
              bookData.coverUrl = base64Full;
              navigate(`/details/${bookData.id}`, { state: { book: bookData } });
          } else {
              setError(t('scan.identify_error'));
              setTimeout(() => setError(null), 3000);
          }

      } catch (err) {
          console.error(err);
          setError(t('scan.error'));
          setTimeout(() => setError(null), 3000);
      } finally {
          setIsScanning(false);
      }
  };

  const handleTextSearch = async () => {
      if(!searchQuery.trim() || isScanning) return;

      try {
          setIsScanning(true);
          // Blur the keyboard
          (document.activeElement as HTMLElement)?.blur();

          const bookData = await searchBookByQuery(searchQuery, language);

          if (bookData) {
              // Use a generic beautiful cover for text searches
              bookData.coverUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop'; 
              navigate(`/details/${bookData.id}`, { state: { book: bookData } });
          } else {
              setError(t('scan.identify_error'));
              setTimeout(() => setError(null), 3000);
          }
      } catch (err) {
          console.error(err);
          setError(t('scan.error'));
          setTimeout(() => setError(null), 3000);
      } finally {
          setIsScanning(false);
      }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden group/design-root">
      {/* Camera View Layer */}
      <div className={`absolute inset-0 z-0 h-full w-full bg-black transition-all duration-500 ${mode === 'search' ? 'blur-xl scale-110 opacity-50' : ''}`}>
        {error && mode === 'camera' ? (
           <div className="flex h-full w-full items-center justify-center p-8 text-center bg-background-dark/90 backdrop-blur-sm z-50 absolute inset-0">
             <div className="flex flex-col items-center gap-4">
               <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
               <p className="text-white font-medium">{error}</p>
             </div>
           </div>
        ) : null}
        
        {stream ? (
             <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="h-full w-full object-cover transform" 
             />
        ) : (
            <div className="flex h-full w-full items-center justify-center bg-black">
               <span className="material-symbols-outlined text-4xl text-white/20 animate-pulse">photo_camera</span>
            </div>
        )}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* UI Overlay Layer */}
      <div className="relative z-10 flex h-full flex-col justify-between pointer-events-none">
        
        {/* Top Header */}
        <header className="flex flex-col gap-4 p-4 pt-6 safe-top pointer-events-auto items-center">
            {/* Mode Toggle */}
             <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button 
                    onClick={() => setMode('camera')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'camera' ? 'bg-primary text-background-dark shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                    {t('scan.mode_camera')}
                </button>
                <button 
                    onClick={() => setMode('search')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === 'search' ? 'bg-primary text-background-dark shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                    {t('scan.mode_search')}
                </button>
             </div>

             <div className="flex w-full justify-between items-start absolute top-6 left-0 px-4 pointer-events-none">
                 <button onClick={() => navigate(-1)} className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                {mode === 'camera' && (
                     <button className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60">
                        <span className="material-symbols-outlined text-2xl">flash_on</span>
                    </button>
                )}
             </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20 w-full pointer-events-auto">
          
          {mode === 'camera' ? (
              // CAMERA MODE UI
              <>
                <div className="relative h-80 w-64 transition-all duration-500">
                    <div className={`absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 rounded-tl-xl transition-colors duration-300 ${isScanning ? 'border-primary shadow-[0_0_10px_rgba(19,236,73,0.5)]' : 'border-white'}`}></div>
                    <div className={`absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 rounded-tr-xl transition-colors duration-300 ${isScanning ? 'border-primary shadow-[0_0_10px_rgba(19,236,73,0.5)]' : 'border-white'}`}></div>
                    <div className={`absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300 ${isScanning ? 'border-primary shadow-[0_0_10px_rgba(19,236,73,0.5)]' : 'border-white'}`}></div>
                    <div className={`absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300 ${isScanning ? 'border-primary shadow-[0_0_10px_rgba(19,236,73,0.5)]' : 'border-white'}`}></div>
                    
                    {isScanning && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(19,236,73,1)] animate-[scan_1.5s_infinite_linear]"></div>
                    )}
                </div>
                <div className="mt-8 text-center">
                    <div className="inline-block bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-all duration-300">
                        <h2 className="text-white tracking-wide text-sm font-bold uppercase leading-tight text-center font-display flex items-center gap-2">
                            {isScanning ? (
                                <>
                                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                {t('scan.identifying')}
                                </>
                            ) : t('scan.align')}
                        </h2>
                    </div>
                </div>
              </>
          ) : (
              // SEARCH MODE UI
              <div className="w-full max-w-md flex flex-col items-center animate-in slide-in-from-bottom-5 fade-in duration-300">
                   <div className="w-full bg-[#121A18]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex flex-col gap-4">
                            <label className="text-primary font-bold uppercase tracking-wider text-xs ml-1">{t('scan.search_hint')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('scan.search_placeholder')}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleTextSearch()}
                                />
                            </div>
                            <button 
                                onClick={handleTextSearch}
                                disabled={isScanning || !searchQuery.trim()}
                                className="w-full bg-primary text-background-dark font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isScanning ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                        {t('scan.searching')}
                                    </>
                                ) : (
                                    <>
                                        {t('scan.search_btn')}
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                   </div>
              </div>
          )}
        </main>

        {/* Bottom Controls */}
        <footer className={`w-full pb-10 pt-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto transition-opacity duration-300 ${mode === 'search' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-center gap-10">
            <button className="flex shrink-0 items-center justify-center rounded-full size-12 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 border border-white/10">
              <span className="material-symbols-outlined text-2xl">photo_library</span>
            </button>
            
            <button 
                onClick={handleCapture}
                disabled={!stream || isScanning || mode === 'search'}
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white ring-2 ring-black/30 transition-all duration-200 backdrop-blur-sm ${isScanning ? 'scale-95 opacity-80 bg-primary/20 border-primary' : 'bg-white/20 hover:bg-white/30 active:scale-95'}`}
            >
              <div className={`h-16 w-16 rounded-full bg-white shadow-inner transition-transform duration-200 ${isScanning ? 'scale-90 bg-primary' : ''}`}></div>
            </button>
            
            <button className="flex shrink-0 items-center justify-center rounded-full size-12 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 border border-white/10">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </button>
          </div>
        </footer>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Scanner;
