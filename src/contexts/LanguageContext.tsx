import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Language, translations, getTranslation } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ru']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  const getInitialLanguage = (): Language => {
    const urlLang = searchParams.get('lang');
    if (urlLang && ['ru', 'en', 'de'].includes(urlLang)) {
      return urlLang as Language;
    }
    return 'ru';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', lang);
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang && ['ru', 'en', 'de'].includes(urlLang) && urlLang !== language) {
      setLanguageState(urlLang as Language);
    }
  }, [searchParams]);

  const t = (key: keyof typeof translations['ru']) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
