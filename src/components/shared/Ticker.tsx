"use client";

import { useEffect, useRef } from "react";

export default function Ticker({ items, accent }: { items: string[]; accent: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tick = () => {
      posRef.current -= 0.55;
      const half = track.scrollWidth / 2;
      if (posRef.current <= -half) posRef.current += half;
      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex items-center will-change-transform whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 pr-2.5">
            <span
              className="text-[10px] font-black tracking-[0.22em] uppercase"
              style={{ color: accent }}
            >
              {item}
            </span>
            <span style={{ color: `${accent}55`, fontSize: 5 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
