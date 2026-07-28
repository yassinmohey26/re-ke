'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './CollapsibleDescription.module.css';

export default function CollapsibleDescription({ html }: { html: string }) {
  const t = useTranslations('tours');
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setNeedsCollapse(ref.current.scrollHeight > ref.current.clientHeight + 2);
    }
  }, [html]);

  return (
    <div className={styles.wrapper}>
      <div
        ref={ref}
        className={`${styles.description} ${expanded ? styles.expanded : styles.collapsed}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!expanded && needsCollapse && (
        <button className={styles.button} onClick={() => setExpanded(true)}>
          {t('seeMore')}
        </button>
      )}
      {expanded && needsCollapse && (
        <button className={styles.button} onClick={() => { setExpanded(false); ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }}>
          {t('seeLess')}
        </button>
      )}
    </div>
  );
}
