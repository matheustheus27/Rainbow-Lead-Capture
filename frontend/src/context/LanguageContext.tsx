import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LANGUAGE_STORAGE_KEY = 'iris_crm_language';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt-BR';

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (saved && (saved === 'pt-BR' || saved === 'en')) {
      return saved;
    }

    // Sniff browser runtime language
    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    if (browserLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
  } catch {
    // Fallback on error
  }

  // Portuguese (pt-BR) is the absolute default
  return 'pt-BR';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch {
      // Ignore local storage error
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'pt-BR' ? 'en' : 'pt-BR'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
