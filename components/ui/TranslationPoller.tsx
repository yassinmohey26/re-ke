'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL = 30_000; // 30 seconds

export default function TranslationPoller() {
  const router = useRouter();
  const currentVersion = useRef(0);
  const initialized = useRef(false);

  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch('/api/translations/version', { cache: 'no-store' });
      const data = await res.json();

      if (initialized.current && data.version > 0 && data.version !== currentVersion.current) {
        // Translations changed — refresh the page
        router.refresh();
      }

      currentVersion.current = data.version;
      initialized.current = true;
    } catch {
      // Ignore errors — will retry on next poll
    }
  }, [router]);

  useEffect(() => {
    // Initial version check
    checkVersion();

    // Poll interval
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    // Also check on visibility change (when user tabs back)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkVersion]);

  return null;
}
