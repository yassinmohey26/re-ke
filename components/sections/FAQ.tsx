'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItemComponent({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <div className={[styles.item, isOpen ? styles.open : ''].join(' ')}>
      <button
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
        id={`faq-trigger-${index}`}
        aria-controls={`faq-panel-${index}`}
      >
        <span className={styles.triggerText}>{question}</span>
        <span className={styles.icon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d={isOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
          </svg>
        </span>
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className={styles.panel}
        style={{ maxHeight: isOpen ? '400px' : '0' }}
      >
        <div className={styles.panelInner}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations('faq');

  return (
    <section className={`section section--light ${styles.section}`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className="section-eyebrow">{t('eyebrow')}</span>
            <h2 className="section-title">{t('title')}</h2>
            <p className={styles.desc}>
              {t('description')}
            </p>
            <div className={styles.contactActions}>
              <Link href="/kontakt" className="btn btn--primary">
                {t('contactBtn')}
              </Link>
            </div>
          </div>
          <div className={styles.right}>
            {faqs.length === 0 ? (
              <p>{t('noFaqs')}</p>
            ) : (
              faqs.map((faq, i) => (
                <FAQItemComponent
                  key={i}
                  index={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
