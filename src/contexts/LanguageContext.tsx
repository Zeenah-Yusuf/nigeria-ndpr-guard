import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';

// Import translations
import en from '../translations/en.json';
import ha from '../translations/ha.json';
import ig from '../translations/ig.json';
import yo from '../translations/yo.json';

export type Language = 'en' | 'ha' | 'ig' | 'yo';

// Define the translation type as a nested object
type TranslationValue = string | number | boolean | Record<string, unknown>;
type TranslationObject = Record<string, TranslationValue>;

const translations: Record<Language, TranslationObject> = { 
  en: en as TranslationObject, 
  ha: ha as TranslationObject, 
  ig: ig as TranslationObject, 
  yo: yo as TranslationObject 
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested value from object using dot notation
const getNestedValue = (obj: TranslationObject, path: string): string | undefined => {
  if (!path) return undefined;
  
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : 
         typeof current === 'number' ? String(current) : 
         undefined;
};

// Available languages with display names
const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ha' as Language, name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig' as Language, name: 'Igbo', nativeName: 'Igbo' },
  { code: 'yo' as Language, name: 'Yoruba', nativeName: 'Yoruba' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('regtrack-language') as Language;
      if (saved && ['en', 'ha', 'ig', 'yo'].includes(saved)) {
        return saved;
      }
    } catch (error) {
      console.error('Failed to load language from localStorage:', error);
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('regtrack-language', lang);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ha' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (!key) return '';
    
    // Try to get translation from current language
    let translation = getNestedValue(translations[language], key);
    
    // Fallback to English if not found and current language is not English
    if (!translation && language !== 'en') {
      translation = getNestedValue(translations.en, key);
    }
    
    // Return key if translation not found
    let result = translation || key;
    
    // Replace parameters if provided
    if (params && result) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        const regex = new RegExp(`{{${paramKey}}}`, 'g');
        result = result.replace(regex, String(paramValue));
      });
    }
    
    return result;
  }, [language]);

  // Set document language on mount and when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ha' ? 'rtl' : 'ltr';
  }, [language]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    availableLanguages,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Optional: Helper hook to get a specific translation with type safety
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}

// Optional: Helper to get current language direction
export function useLanguageDirection() {
  const { language } = useLanguage();
  return language === 'ha' ? 'rtl' : 'ltr';
}