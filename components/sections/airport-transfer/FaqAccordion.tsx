'use client';

import { useState } from 'react';
import styles from './FaqAccordion.module.css';

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  heading: string;
  items: FaqItem[];
}

export default function FaqAccordion({ heading, items }: Props) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={styles.item}>
              <button
                className={styles.question}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
