export default function FlagIcon({ code, size = 20 }: { code: string; size?: number }) {
  const h = Math.round(size * 0.667);

  const wrap = (label: string, children: React.ReactNode) => (
    <span
      aria-label={label}
      style={{
        display: 'inline-block',
        width: size,
        height: h,
        borderRadius: 2,
        overflow: 'hidden',
        flexShrink: 0,
        verticalAlign: 'middle',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        lineHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 60 40"
        width={size}
        height={h}
        style={{ display: 'block' }}
      >
        {children}
      </svg>
    </span>
  );

  switch (code) {
    case 'de':
      return wrap('Deutsch', (
        <>
          <rect width="60" height="13.33" y="0" fill="#000" />
          <rect width="60" height="13.33" y="13.33" fill="#DD0000" />
          <rect width="60" height="13.34" y="26.66" fill="#FFCC00" />
        </>
      ));

    case 'en':
      return wrap('English', (
        <>
          <rect width="60" height="40" fill="#012169" />
          <line x1="0" y1="0" x2="60" y2="40" stroke="#fff" strokeWidth="6" />
          <line x1="60" y1="0" x2="0" y2="40" stroke="#fff" strokeWidth="6" />
          <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="2" />
          <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="2" />
          <rect x="25" y="0" width="10" height="40" fill="#fff" />
          <rect x="0" y="15" width="60" height="10" fill="#fff" />
          <rect x="27" y="0" width="6" height="40" fill="#C8102E" />
          <rect x="0" y="17" width="60" height="6" fill="#C8102E" />
        </>
      ));

    case 'ru':
      return wrap('Русский', (
        <>
          <rect width="60" height="13.33" y="0" fill="#fff" />
          <rect width="60" height="13.33" y="13.33" fill="#0039A6" />
          <rect width="60" height="13.34" y="26.66" fill="#D52B1E" />
        </>
      ));

    case 'ar':
      return wrap('العربية', (
        <>
          <rect width="60" height="13.33" y="0" fill="#CE1126" />
          <rect width="60" height="13.33" y="13.33" fill="#fff" />
          <rect width="60" height="13.34" y="26.66" fill="#000" />
          <g transform="translate(30,20) scale(0.4)">
            <path d="M0-25C3-25 6-23 8-20L12-14C14-10 13-6 10-3L6 0L10 2L14 6L16 12L14 14L10 12L6 8L2 10L0 14L-2 10L-6 8L-10 12L-14 14L-16 12L-14 6L-10 2L-6 0L-10-3C-13-6-14-10-12-14L-8-20C-6-23-3-25 0-25Z" fill="#C09300" stroke="#000" strokeWidth="0.5" />
            <circle cx="0" cy="-18" r="2" fill="#000" />
          </g>
        </>
      ));

    case 'fr':
      return wrap('Français', (
        <>
          <rect width="20" height="40" fill="#002395" />
          <rect x="20" width="20" height="40" fill="#fff" />
          <rect x="40" width="20" height="40" fill="#ED2939" />
        </>
      ));

    case 'hu':
      return wrap('Magyar', (
        <>
          <rect width="60" height="13.33" y="0" fill="#CE2939" />
          <rect width="60" height="13.33" y="13.33" fill="#fff" />
          <rect width="60" height="13.34" y="26.66" fill="#477050" />
        </>
      ));

    default:
      return null;
  }
}
