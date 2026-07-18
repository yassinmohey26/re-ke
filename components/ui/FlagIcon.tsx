export default function FlagIcon({ code, size = 20 }: { code: string; size?: number }) {
  const style = {
    width: size,
    height: Math.round(size * 0.667),
    borderRadius: 2,
    overflow: 'hidden' as const,
    flexShrink: 0,
    display: 'inline-block',
    verticalAlign: 'middle',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  };

  switch (code) {
    case 'de':
      return (
        <span style={style} aria-label="Deutsch">
          <svg viewBox="0 0 60 40" width={size} height={Math.round(size * 0.667)}>
            <rect width="60" height="13.33" y="0" fill="#000" />
            <rect width="60" height="13.33" y="13.33" fill="#DD0000" />
            <rect width="60" height="13.34" y="26.66" fill="#FFCC00" />
          </svg>
        </span>
      );

    case 'en':
      return (
        <span style={style} aria-label="English">
          <svg viewBox="0 0 60 40" width={size} height={Math.round(size * 0.667)}>
            <rect width="60" height="40" fill="#012169" />
            {/* White diagonals */}
            <line x1="0" y1="0" x2="60" y2="40" stroke="#fff" strokeWidth="6" />
            <line x1="60" y1="0" x2="0" y2="40" stroke="#fff" strokeWidth="6" />
            {/* Red diagonals */}
            <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="2" />
            <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="2" />
            {/* White cross */}
            <rect x="25" y="0" width="10" height="40" fill="#fff" />
            <rect x="0" y="15" width="60" height="10" fill="#fff" />
            {/* Red cross */}
            <rect x="27" y="0" width="6" height="40" fill="#C8102E" />
            <rect x="0" y="17" width="60" height="6" fill="#C8102E" />
          </svg>
        </span>
      );

    case 'ru':
      return (
        <span style={style} aria-label="Русский">
          <svg viewBox="0 0 60 40" width={size} height={Math.round(size * 0.667)}>
            <rect width="60" height="13.33" y="0" fill="#fff" />
            <rect width="60" height="13.33" y="13.33" fill="#0039A6" />
            <rect width="60" height="13.34" y="26.66" fill="#D52B1E" />
          </svg>
        </span>
      );

    default:
      return null;
  }
}
