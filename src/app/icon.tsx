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
          <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
          <path d="m12 12 3.5 3.5 3.5-3.5-3.5-3.5Z"/>
          <path d="M2 8.5h20"/>
          <path d="M5 15.5h14"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
