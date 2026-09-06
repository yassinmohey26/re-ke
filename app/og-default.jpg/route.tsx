import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          color: 'white',
          background:
            'linear-gradient(135deg, #003d82 0%, #0057b8 55%, #0b8fb8 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#f6c453',
          }}
        >
          Hurghada Reiseplaner
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: 960,
            marginTop: 30,
            fontSize: 72,
            lineHeight: 1.08,
            fontWeight: 700,
          }}
        >
          Unforgettable experiences in Egypt
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 30,
            color: '#e5f4ff',
          }}
        >
          Private tours · Red Sea adventures · Personal service
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
