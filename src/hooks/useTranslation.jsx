import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../config/translations';

const localeMap = {
  fr: 'fr-FR',
  en: 'en-US',
  de: 'de-DE',
  zh: 'zh-CN',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
};

const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState('fr');

  const t = useCallback((keyPath) => {
    const keys = keyPath.split('.');
    let value = translations[lang];
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return keyPath;
      }
    }
    return value || keyPath;
  }, [lang]);

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    document.documentElement.lang = newLang;
  }, []);

  const locale = localeMap[lang] || 'fr-FR';

  return (
    <TranslationContext.Provider value={{ lang, t, changeLang, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}