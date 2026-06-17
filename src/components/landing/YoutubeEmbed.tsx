"use client";

import { useState } from "react";

interface YoutubeEmbedProps {
  videoId: string;
  title: string;
}

export function YoutubeEmbed({ videoId, title }: YoutubeEmbedProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <>
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <button
        aria-label="Reproducir vídeo de demostración"
        className="absolute inset-0 flex items-center justify-center group"
        onClick={() => setActive(true)}
      >
        <span className="w-16 h-16 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center shadow-lg transition">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-brand-600 translate-x-0.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    </>
  );
}
