import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { AdminLanguageProvider } from './AdminLanguageContext';
import { AdminThemeProvider } from './AdminThemeContext';
import AdminTopBar from './AdminTopBar';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'ZAIMOZ – Hurghada Reiseplaner',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // treat as unauthenticated
  }
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <AdminLanguageProvider>
      <AdminThemeProvider>
        <AdminSidebar user={session.user as any} />
        <AdminTopBar />
        <main className={styles.adminMain}>
          <div className={styles.adminContent}>{children}</div>
        </main>
      </AdminThemeProvider>
    </AdminLanguageProvider>
  );
}
