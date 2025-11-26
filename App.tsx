
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Library from './pages/Library';
import BookDetails from './pages/BookDetails';
import Scanner from './pages/Scanner';
import Recommendations from './pages/Recommendations';
import History from './pages/History';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import { LanguageProvider } from './contexts/LanguageContext';
import { LibraryProvider } from './contexts/LibraryContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide bottom nav on specific pages if needed, e.g., Scanner for immersion
  const showBottomNav = location.pathname !== '/scanner';

  return (
    <div className="relative min-h-screen w-full bg-background-dark text-text-dark font-body overflow-x-hidden selection:bg-primary selection:text-background-dark">
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/library" element={<Library />} />
          <Route path="/details/:id" element={<BookDetails />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        {showBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <LibraryProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </LibraryProvider>
    </LanguageProvider>
  );
};

export default App;
