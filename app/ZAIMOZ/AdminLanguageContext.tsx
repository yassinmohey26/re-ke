'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminLocale, getAdminTranslation, TranslationKey } from './admin-i18n';

interface AdminLanguageContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  confirmDiscardChanges: () => boolean;
  t: (key: TranslationKey) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | null>(null);

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('de');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-locale') as AdminLocale | null;
    if (saved === 'de' || saved === 'en' || saved === 'ru' || saved === 'ar' || saved === 'fr' || saved === 'hu') setLocaleState(saved);
  }, []);

  function setLocale(l: AdminLocale) {
    if (l === locale) return;
    if (!confirmDiscardChanges()) return;
    setLocaleState(l);
    localStorage.setItem('admin-locale', l);
  }

  function confirmDiscardChanges(): boolean {
    if (!hasUnsavedChanges) return true;
    const confirmed = window.confirm(getAdminTranslation('tourLeaveUnsaved', locale));
    if (confirmed) setHasUnsavedChanges(false);
    return confirmed;
  }

  function t(key: TranslationKey): string {
    return getAdminTranslation(key, locale);
  }

  return (
    <AdminLanguageContext.Provider value={{ locale, setLocale, hasUnsavedChanges, setHasUnsavedChanges, confirmDiscardChanges, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLanguageProvider');
  return ctx;
}
