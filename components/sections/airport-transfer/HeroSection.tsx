'use client';

import styles from './HeroSection.module.css';
import TransferActions from './TransferActions';

interface Props {
  image: string;
  title: string;
  subtitle: string;
  bookingText: string;
  whatsappText: string;
}

export default function HeroSection({
  image,
  title,
  subtitle,
  bookingText,
  whatsappText,
}: Props) {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay} />
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <TransferActions
            bookingText={bookingText}
            whatsappText={whatsappText}
            compact
          />
        </div>
      </div>
    </section>
  );
}
