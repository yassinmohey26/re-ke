'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminLocale, getAdminTranslation, TranslationKey } from './admin-i18n';

interface AdminLanguageContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: TranslationKey) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | null>(null);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('de');

  useEffect(() => {
    const saved = localStorage.getItem('admin-locale') as AdminLocale | null;
    if (saved === 'de' || saved === 'en' || saved === 'ru') setLocaleState(saved);
  }, []);

  function setLocale(l: AdminLocale) {
    setLocaleState(l);
    localStorage.setItem('admin-locale', l);
  }

  function t(key: TranslationKey): string {
    return getAdminTranslation(key, locale);
  }

  return (
    <AdminLanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLanguageProvider');
  return ctx;
}
