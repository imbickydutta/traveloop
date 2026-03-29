"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent, type MotionValue } from "framer-motion";
import Image from "next/image";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";
import { TripDay } from "@/types/trip";

const RENDER_WINDOW   = 2;
const SCROLL_PER_CARD = 80;
const TILTS           = [0, -4, 3, -5, 3.5, -3, 4.5, -3.5, 2.5];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
  return mobile;
}

/* ── Stack card ── */
function StackCard({
  day, index, activeIndex, activeValue, accent, isMobile,
}: {
  day: TripDay;
  index: number;
  activeIndex: MotionValue<number>;
  activeValue: number;
  accent: string;
  isMobile: boolean;
}) {
  const isLeft = day.side === "left";
  const isNear = Math.abs(index - activeValue) <= 2;

  const y = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos >  1.2) return "110vh";
    if (pos >  0)   return `${pos * 80}vh`;
    return "0vh";
  });

  const rotate = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos > -0.05) return 0;
    const t = Math.min(1, (Math.abs(pos) - 0.05) / 0.9);
    return TILTS[index % TILTS.length] * t;
  });

  const scale = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos >  1)   return 0.86;
    if (pos >  0)   return 0.86 + (1 - pos) * 0.16;
    if (!isMobile && pos > -0.15) return 1.02 - Math.abs(pos) / 0.15 * 0.02;
    return 1.0;
  });

  const opacity = useTransform(activeIndex, (a) => {
    const pos   = index - a;
    const depth = -pos;
    if (pos >  1.2) return 0;
    if (depth > 5)  return Math.max(0, 1 - (depth - 5) * 0.4);
    return 1;
  });

  const transform = useMotionTemplate`translateY(${y}) rotate(${rotate}deg) scale(${scale})`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform, opacity, zIndex: index + 1, willChange: isNear ? "transform" : "auto" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden w-[calc(85vw-27px)] sm:w-[500px] h-[49vh] sm:h-[58vh]"
        style={{
          boxShadow: isMobile
            ? "0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 32px 80px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <Image src={day.image} alt="" fill sizes="(max-width: 640px) calc(85vw - 27px), 500px" className="object-cover object-center" priority={index === 0} />
        <div className="absolute bottom-0 inset-x-0 h-[70%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)" }} />

        {/* Day number + date */}
        <div className={`absolute top-5 ${isLeft ? "left-5" : "right-5"} flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
          <span className="font-black leading-none tracking-tighter" style={{ fontSize: "clamp(2.8rem, 9vh, 4.5rem)", color: accent }}>
            {String(day.day).padStart(2, "0")}
          </span>
          <span className="text-[12px] font-bold tracking-[0.28em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            {day.date}
          </span>
        </div>

        {/* Text panel */}
        <div className={`absolute bottom-0 left-0 right-0 px-5 pb-6 pt-10 ${isLeft ? "" : "text-right"}`}>
          <p className="text-[12px] font-bold tracking-[0.25em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.65)" }}>
            {day.location}
          </p>
          <h3 className="font-script font-bold leading-[1.1] text-white mb-3"
            style={{ fontSize: "clamp(1.5rem, 5vh, 2rem)", textShadow: isMobile ? undefined : "0 2px 16px rgba(0,0,0,0.7)" }}>
            {day.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: accent }} className="italic">
              {day.title.split(" ").slice(-1)[0]}
            </span>
          </h3>
          <div className="mb-4 h-px w-12" style={{ background: `${accent}80`, marginLeft: isLeft ? 0 : "auto" }} />
          <ul className={`space-y-2.5 ${isLeft ? "" : "flex flex-col items-end"}`}>
            {day.bullets.map((b, j) => (
              <li key={j} className={`flex items-center gap-3 text-[13px] font-medium ${isLeft ? "" : "flex-row-reverse"}`}
                style={{ color: "rgba(255,255,255,0.88)", textShadow: isMobile ? undefined : "0 1px 8px rgba(0,0,0,0.8)" }}>
                <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: accent }} />
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressBar({ activeIndex, total, accent }: { activeIndex: MotionValue<number>; total: number; accent: string }) {
  const scaleX = useTransform(activeIndex, [0, total - 1], [0, 1]);
  return (
    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/8 z-[60]">
      <motion.div className="h-full origin-left" style={{ scaleX, background: accent }} />
    </div>
  );
}

function Dots({ activeIndex, total, accent }: { activeIndex: MotionValue<number>; total: number; accent: string }) {
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(activeIndex, "change", (v) => setCurrent(Math.round(v)));
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-[6px] z-[60]">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-[4px] rounded-full transition-all duration-300"
          style={{ width: i === current ? 20 : 5, opacity: i === current ? 1 : 0.28, background: accent }} />
      ))}
    </div>
  );
}

interface TripScrollJourneyProps {
  days:   TripDay[];
  accent: string;
}

export default function TripScrollJourney({ days, accent }: TripScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, days.length - 0.001]);

  const isMobile = useIsMobile();
  const [activeValue, setActiveValue] = useState(0);
  useMotionValueEvent(activeIndex, "change", (v) => setActiveValue(Math.round(v)));

  // Derive a subtle background from the accent colour
  const hex = accent.replace("#", "");
  const r   = parseInt(hex.slice(0, 2), 16);
  const g   = parseInt(hex.slice(2, 4), 16);
  const b   = parseInt(hex.slice(4, 6), 16);
  const bg  = `
    radial-gradient(ellipse 55% 50% at 8% 55%,  rgba(${r},${g},${b},0.28) 0%, rgba(${r},${g},${b},0.09) 45%, transparent 70%),
    radial-gradient(ellipse 50% 55% at 65% 10%, rgba(${Math.min(r+40,255)},${Math.min(g+40,255)},${b},0.18) 0%, transparent 70%),
    radial-gradient(ellipse 45% 50% at 45% 40%, rgba(${r},${Math.min(g+30,255)},${Math.min(b+60,255)},0.14) 0%, transparent 70%),
    #0a0a0a
  `;

  return (
    <div ref={containerRef} style={{ height: `${days.length * SCROLL_PER_CARD}vh` }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden" style={{ contain: "strict", willChange: "transform", transform: "translateZ(0)" }}>

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: bg }}>
          {!isMobile && <StarfieldCanvas opacity={0.45} />}
          {!isMobile && (
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat", backgroundSize: "128px",
            }} />
          )}
        </div>

        {/* Header */}
        <div className="absolute top-16 inset-x-0 z-[70] flex flex-col items-center pointer-events-none">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: accent }}>Day-by-Day</p>
          <h2 className="text-2xl sm:text-3xl font-script font-bold leading-none text-white">
            The <span className="italic" style={{ color: accent }}>Journey</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="absolute inset-0">
          {days.map((day, i) => {
            if (Math.abs(i - activeValue) > RENDER_WINDOW) return null;
            return (
              <StackCard key={day.day} day={day} index={i} activeIndex={activeIndex} activeValue={activeValue} accent={accent} isMobile={isMobile} />
            );
          })}
        </div>

        <ProgressBar activeIndex={activeIndex} total={days.length} accent={accent} />
        <Dots        activeIndex={activeIndex} total={days.length} accent={accent} />
      </div>
    </div>
  );
}
