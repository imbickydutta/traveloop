"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  /** HLS or MP4 video URL (e.g. from Bunny.net) */
  src: string;
  /** Fallback static poster image URL */
  poster?: string;
  /** Extra overlay opacity 0–1 (default 0.55) */
  overlayOpacity?: number;
  /** Additional className on the wrapper */
  className?: string;
  children?: React.ReactNode;
}

/**
 * Full-bleed video background.
 * - Autoplay, muted, loop for hero sections
 * - Falls back to poster image on mobile if user prefers reduced data
 * - Overlay is a dark gradient for text legibility
 */
export default function VideoBackground({
  src,
  poster,
  overlayOpacity = 0.55,
  className = "",
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Try to play; if it fails (mobile autoplay policy) the poster shows
    video.play().catch(() => {});
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video layer */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
      />

      {/* Poster visible while video loads */}
      {poster && !videoLoaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,${overlayOpacity * 0.6}) 0%,
            rgba(0,0,0,${overlayOpacity * 0.3}) 40%,
            rgba(0,0,0,${overlayOpacity}) 100%
          )`,
        }}
      />

      {/* Content — flex-col flex-1 so children can use flex-1 / mt-auto */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">{children}</div>
    </div>
  );
}
