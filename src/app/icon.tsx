import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'hsl(235 63% 30%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px'
        }}
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(210 40% 98%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5Z"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.9 4.9 1.4 1.4"/>
          <path d="m17.7 17.7 1.4 1.4"/>
          <path d="m4.9 19.1 1.4-1.4"/>
          <path d="m17.7 6.3 1.4-1.4"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
