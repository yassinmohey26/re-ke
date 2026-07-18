import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'ZAIMOZ Login',
  description: 'ZAIMOZ-Bereich einloggen',
};

export default async function LoginPage() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // ignore
  }
  if (session?.user) {
    redirect('/ZAIMOZ');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-2)',
      padding: 'var(--space-8)',
    }}>
      <LoginForm />
    </div>
  );
}
