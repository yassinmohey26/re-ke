import { Link } from '@/i18n/navigation';
import styles from './TransferActions.module.css';

interface Props {
  bookingText: string;
  whatsappText: string;
  compact?: boolean;
}

export default function TransferActions({
  bookingText,
  whatsappText,
  compact = false,
}: Props) {
  return (
    <div className={`${styles.actions} ${compact ? styles.compact : ''}`}>
      <Link href="/kontakt" className={styles.primary}>
        {bookingText}
      </Link>
      <a
        href="https://wa.me/4368181140099"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.secondary}
      >
        {whatsappText}
      </a>
    </div>
  );
}
