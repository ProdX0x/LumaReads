
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.scan': { en: 'Scan', fr: 'Scanner' },
  'nav.history': { en: 'History', fr: 'Historique' },
  'nav.explore': { en: 'Explore', fr: 'Explorer' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },

  // Library
  'lib.title': { en: 'My Library', fr: 'Ma Bibliothèque' },
  'lib.filter.all': { en: 'All', fr: 'Tous' },
  'lib.filter.read': { en: 'Read', fr: 'Lus' },
  'lib.filter.reading': { en: 'Reading', fr: 'En cours' },
  'lib.filter.toread': { en: 'To Read', fr: 'À lire' },

  // Scanner
  'scan.permission': { en: 'Unable to access camera. Please ensure permissions are granted.', fr: 'Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.' },
  'scan.error': { en: 'Analysis failed. Try closer framing.', fr: 'Analyse échouée. Essayez de vous rapprocher.' },
  'scan.identifying': { en: 'Analyzing Book...', fr: 'Analyse du livre...' },
  'scan.searching': { en: 'Searching Archives...', fr: 'Recherche dans les archives...' },
  'scan.align': { en: 'Align Book Cover', fr: 'Aligner la couverture' },
  'scan.identify_error': { en: 'Could not identify a book. Please try again.', fr: 'Impossible d\'identifier le livre. Réessayez.' },
  'scan.mode_camera': { en: 'Camera', fr: 'Caméra' },
  'scan.mode_search': { en: 'Search', fr: 'Recherche' },
  'scan.search_placeholder': { en: 'Enter book title or author...', fr: 'Titre du livre ou auteur...' },
  'scan.search_btn': { en: 'Find Book', fr: 'Trouver le livre' },
  'scan.search_hint': { en: 'Search for books to add to your library manually.', fr: 'Recherchez manuellement des livres à ajouter.' },

  // Book Details
  'detail.summary': { en: 'Summary', fr: 'Résumé' },
  'detail.philosophy': { en: 'Core Philosophy', fr: 'Philosophie Centrale' },
  'detail.ideas': { en: 'Main Ideas', fr: 'Idées Clés' },
  'detail.ask_ai': { en: 'Ask AI Companion', fr: 'Demander à l\'IA' },
  'detail.ask_placeholder': { en: 'e.g., What is the main theme?', fr: 'ex: Quel est le thème principal ?' },
  'detail.thinking': { en: 'Thinking...', fr: 'Réflexion...' },
  'detail.empty_ai': { en: 'Ask me anything about', fr: 'Posez-moi une question sur' },
  'detail.category': { en: 'Category', fr: 'Catégorie' },
  'detail.generate_full': { en: 'Generate Full Analysis', fr: 'Générer l\'Analyse Complète' },
  'detail.generate_basic': { en: 'Generate Book Sheet', fr: 'Créer la Fiche du Livre' },
  'detail.generating': { en: 'Analyzing literary context...', fr: 'Analyse du contexte littéraire...' },
  'detail.generating_basic': { en: 'Writing book summary...', fr: 'Rédaction de la fiche...' },
  'detail.influences': { en: 'Influences & Context', fr: 'Influences & Contexte' },
  'detail.related': { en: 'You might also like', fr: 'Vous aimerez aussi' },
  'detail.classic_recs': { en: 'Echoes from the Past (1500-1850)', fr: 'Échos du Passé (1500-1850)' },
  'detail.preview_mode': { en: 'Preview Mode', fr: 'Mode Aperçu' },
  'detail.preview_desc': { en: 'This is a generated suggestion. Click below to create the full book sheet.', fr: 'Ceci est une suggestion. Cliquez ci-dessous pour générer la fiche complète.' },
  'detail.toast_added': { en: 'Added to Library', fr: 'Ajouté à la bibliothèque' },
  'detail.toast_removed': { en: 'Removed from Library', fr: 'Retiré de la bibliothèque' },
  'detail.status_label': { en: 'Reading Status', fr: 'Statut de lecture' },

  // Recommendations
  'rec.title': { en: 'Curated Collections', fr: 'Collections' },
  'rec.classic_era': { en: 'The Golden Age (1500-1950)', fr: 'L\'Âge d\'Or (1500-1950)' },
  'rec.classic_desc': { en: 'Exceptional works that defined centuries of thought.', fr: 'Œuvres exceptionnelles ayant marqué des siècles de pensée.' },

  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.lang': { en: 'Language', fr: 'Langue' },
  'settings.app_pref': { en: 'App Preferences', fr: 'Préférences de l\'app' },
  'settings.camera': { en: 'AR Camera Settings', fr: 'Réglages Caméra AR' },
  'settings.notif': { en: 'Notifications', fr: 'Notifications' },
  'settings.haptic': { en: 'Audio & Haptic Feedback', fr: 'Retour Audio & Haptique' },
  'settings.account': { en: 'Account', fr: 'Compte' },
  'settings.profile': { en: 'Profile Information', fr: 'Informations de profil' },
  'settings.logout': { en: 'Log Out', fr: 'Se déconnecter' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set default language to French
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
