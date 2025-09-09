'use client'

import React from 'react'

export default function VideoPage() {
  return (
    <div className="w-full h-[60vh] md:h-[60vh] overflow-hidden relative">
      <iframe
        className="w-full h-full absolute top-0 left-0"
        src="https://www.youtube.com/embed/9zLN7gSwq_Q?autoplay=1&mute=1&controls=0&loop=1&playlist=9zLN7gSwq_Q"
        title="Promotional Video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  )
}
