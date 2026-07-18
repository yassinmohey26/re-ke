import styles from './PageHeader.module.css';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  backgroundImage?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  backgroundImage,
}: PageHeaderProps) {
  return (
    <div
      className={[styles.pageHeader, backgroundImage ? styles.withBg : '']
        .filter(Boolean)
        .join(' ')}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {backgroundImage && <div className={styles.overlay} />}
      <div className="container">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
