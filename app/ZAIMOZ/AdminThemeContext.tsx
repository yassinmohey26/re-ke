'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import styles from './layout.module.css';

export type AdminTheme = 'light' | 'dark';

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | null>(null);

const STORAGE_KEY = 'admin-theme';

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('light');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
    if (saved === 'dark' || saved === 'light') setTheme(saved);
  }, []);

  function toggleTheme() {
    setTheme(prev => {
      const next: AdminTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={styles.adminLayout} data-theme={theme}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider');
  return ctx;
}
