'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './CollapsibleItinerary.module.css';

type Step = { title: string; content: string };

const INITIAL_COUNT = 3;

export default function CollapsibleItinerary({ steps }: { steps: Step[] }) {
  const t = useTranslations('tours');
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? steps : steps.slice(0, INITIAL_COUNT);
  const hidden = steps.length - INITIAL_COUNT;

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {visible.map((step, i) => (
          <div key={i} className={styles.step}>
            <div className={styles.number}>{i + 1}</div>
            <div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.content}>{step.content}</p>
            </div>
          </div>
        ))}
      </div>
      {!expanded && hidden > 0 && (
        <button className={styles.button} onClick={() => setExpanded(true)}>
          {t('seeMore')} ({hidden} {t('moreSteps')})
        </button>
      )}
    </div>
  );
}
