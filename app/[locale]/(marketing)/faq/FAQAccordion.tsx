'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.faqList}>
      {items.map((item, i) => (
        <div key={i} className={[styles.faqItem, openIndex === i ? styles.open : ''].filter(Boolean).join(' ')}>
          <button
            className={styles.faqTrigger}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d={openIndex === i ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
            </svg>
          </button>
          <div
            className={styles.faqPanel}
            style={{ maxHeight: openIndex === i ? '500px' : '0' }}
          >
            <p className={styles.faqAnswer}>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
