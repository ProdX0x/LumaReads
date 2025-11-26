import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav.home'), icon: 'home', path: '/' },
    { name: t('nav.scan'), icon: 'document_scanner', path: '/scanner' },
    { name: t('nav.history'), icon: 'history', path: '/history' },
    { name: t('nav.explore'), icon: 'explore', path: '/recommendations' },
    { name: t('nav.settings'), icon: 'settings', path: '/settings' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#121A18]/90 backdrop-blur-md pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-text-subtle-dark hover:text-white'
              }`
            }
          >
            <span className={`material-symbols-outlined text-2xl ${item.icon === 'document_scanner' ? '' : ''}`} style={item.icon === 'document_scanner' ? {fontVariationSettings: "'FILL' 0"} : {}}>
                {item.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default BottomNav;