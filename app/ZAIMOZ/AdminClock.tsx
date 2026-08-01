'use client';

import { useState, useEffect } from 'react';
import styles from './AdminClock.module.css';

function formatTime(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function AdminClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.clock} aria-live="off">
      <span className={styles.clockIcon}>🕐</span>
      <span className={styles.clockTime}>{time}</span>
    </div>
  );
}
