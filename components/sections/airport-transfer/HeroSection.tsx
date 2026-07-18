'use client';

import styles from './HeroSection.module.css';

interface Props {
  image: string;
  title: string;
  subtitle: string;
}

export default function HeroSection({ image, title, subtitle }: Props) {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay} />
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
