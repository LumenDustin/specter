import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'
export const alt = 'SPECTER Case File'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: caseData } = await supabase
    .from('cases')
    .select('title, case_number, classification, difficulty')
    .eq('slug', params.slug)
    .single()

  const title = caseData?.title || 'Unknown Case'
  const caseNumber = caseData?.case_number || '0000'
  const classification = caseData?.classification || 'UNKNOWN'
  const difficulty = caseData?.difficulty || 'unknown'

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
        {/* Classification Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            backgroundColor: classification === 'RED' ? '#450a0a' : '#451a03',
            border: `2px solid ${classification === 'RED' ? '#7f1d1d' : '#78350f'}`,
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: classification === 'RED' ? '#f87171' : '#fbbf24',
              fontFamily: 'monospace',
            }}
          >
            CLASSIFICATION: {classification}
          </span>
        </div>

        {/* Case Number */}
        <div
          style={{
            fontSize: '28px',
            color: '#71717a',
            fontFamily: 'monospace',
            marginBottom: '12px',
          }}
        >
          CASE #{caseNumber}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#fafafa',
            textAlign: 'center',
            maxWidth: '900px',
            marginBottom: '24px',
          }}
        >
          {title}
        </div>

        {/* Difficulty */}
        <div
          style={{
            fontSize: '20px',
            color: '#a1a1aa',
            textTransform: 'capitalize',
          }}
        >
          {difficulty} Level Investigation
        </div>

        {/* SPECTER Logo */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#ef4444',
              fontFamily: 'monospace',
            }}
          >
            SPECTER
          </span>
          <span
            style={{
              fontSize: '20px',
              color: '#52525b',
            }}
          >
            Paranormal Investigation Bureau
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
