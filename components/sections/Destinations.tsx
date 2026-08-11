'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import styles from './Destinations.module.css';

interface DestinationItem {
  slug: string;
  name: string;
  image: string;
}

export default function Destinations({ destinations }: { destinations: DestinationItem[] }) {
  const t = useTranslations('homeDest');
  const tDest = useTranslations('destinations');

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className="section-title">
              {t('titlePart1')}{' '}
              <span className="text-accent">{t('titleAccent')}</span>
            </h2>
          </div>
          <Link href="/destinationen" className="btn btn--ghost">
            {t('viewAll')}
          </Link>
        </div>
        <div className={styles.grid}>
          {destinations.length === 0 ? (
            <p>{tDest('noDestinations')}</p>
          ) : (
            destinations.map((dest, i) => (
              <Link
                key={dest.slug}
                href={`/touren?destination=${dest.slug}`}
                className={[styles.card, styles[`pos${i}`]].join(' ')}
                aria-label={dest.name}
              >
                {dest.image ? (
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={styles.cardImg}
                    quality={85}
                  />
                ) : (
                  <div className={styles.cardImg} style={{ background: 'var(--color-text-1)', width: '100%', height: '100%' }} />
                )}
                <h3 className={styles.cardName}>{dest.name}</h3>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
