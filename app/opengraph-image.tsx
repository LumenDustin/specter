import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SPECTER - Paranormal Investigation Bureau'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1a0a0a 0%, #0a0a0a 70%)',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            border: '2px solid #7f1d1d',
            borderRadius: '9999px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#f87171',
              fontFamily: 'monospace',
            }}
          >
            CLASSIFIED INVESTIGATIONS
          </span>
        </div>

        {/* Logo */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 'bold',
            color: '#ef4444',
            fontFamily: 'monospace',
            marginBottom: '16px',
          }}
        >
          SPECTER
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: '#a1a1aa',
            marginBottom: '48px',
          }}
        >
          Paranormal Investigation Bureau
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: '#71717a',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Investigate unexplained phenomena. Uncover the truth behind cases the world isn&apos;t ready to know.
        </div>

        {/* Stats */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '60px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#a1a1aa', fontFamily: 'monospace' }}>3+</span>
            <span style={{ fontSize: '14px', color: '#52525b' }}>ACTIVE CASES</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#a1a1aa', fontFamily: 'monospace' }}>2</span>
            <span style={{ fontSize: '14px', color: '#52525b' }}>SOLUTION LAYERS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#a1a1aa', fontFamily: 'monospace' }}>∞</span>
            <span style={{ fontSize: '14px', color: '#52525b' }}>MYSTERIES</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
