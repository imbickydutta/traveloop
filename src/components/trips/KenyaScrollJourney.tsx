"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent, type MotionValue } from "framer-motion";
import Image from "next/image";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";

/* How many cards away from active to keep mounted (each side) */
const RENDER_WINDOW = 3;

/* Pause starfield on any mobile screen — no phone has a desktop-class GPU */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
  return mobile;
}

const ACCENT  = "#f5a623";
const SCROLL_PER_CARD = 80; // vh of scroll space per card

/* Per-card resting tilt — alternates so the stack fans naturally */
const TILTS = [0, -4, 3, -5, 3.5, -3, 4.5, -3.5, 2.5];

const DAYS = [
  { day: 0, date: "05 June", location: "Kolkata → Nairobi",
    title: "The Journey Begins",   image: "/images/trips/kenya/kenya-4.webp", side: "left"  as const,
    bullets: ["Depart via Emirates (Kolkata) or Kenya Airways (Mumbai)", "International flights not included"] },
  { day: 1, date: "06 June", location: "Nairobi",
    title: "Welcome to Kenya",      image: "/images/trips/kenya/kenya-2.jpg",  side: "right" as const,
    bullets: ["Giraffe Centre — feed Rothschild giraffes", "Welcome dinner with fellow travellers"] },
  { day: 2, date: "07 June", location: "Nairobi → Amboseli",
    title: "Into the Wild",         image: "/images/trips/kenya/kenya-1.jpg",  side: "left"  as const,
    bullets: ["First game drive against Mount Kilimanjaro", "Bonfire dinner under the African sky"] },
  { day: 3, date: "08 June", location: "Amboseli National Park",
    title: "Wild Majesty of Amboseli", image: "/images/trips/kenya/kenya-3.jpg", side: "right" as const,
    bullets: ["Sunrise over the peak of Kilimanjaro", "Full-day game drive + savannah picnic"] },
  { day: 4, date: "09 June", location: "Amboseli → Rift Valley",
    title: "The Flamingo Lakes",   image: "/images/trips/kenya/kenya-4.webp", side: "left"  as const,
    bullets: ["Great Rift Valley viewpoint stop", "Sunset over Lake Elementaita"] },
  { day: 5, date: "10 June", location: "Lake Nakuru · Hell's Gate",
    title: "Flamingos & Cycling",   image: "/images/trips/kenya/kenya-2.jpg",  side: "right" as const,
    bullets: ["Lake Nakuru — flamingos & white rhinos", "Cycling safari in Hell's Gate"] },
  { day: 6, date: "11 June", location: "Lake Naivasha → Masai Mara",
    title: "The Legendary Mara",    image: "/images/trips/kenya/kenya-1.jpg",  side: "left"  as const,
    bullets: ["Boat safari on Lake Naivasha", "First Big Five game drive in the Mara"] },
  { day: 7, date: "12 June", location: "Masai Mara National Reserve",
    title: "The Ultimate Safari",   image: "/images/trips/kenya/kenya-3.jpg",  side: "right" as const,
    bullets: ["Big Five — lions, leopards, elephants", "African Sundowner 🍹 on the plains"] },
  { day: 8, date: "13 June", location: "Masai Mara → Nairobi",
    title: "Farewell, Kenya",        image: "/images/trips/kenya/kenya-2.jpg",  side: "left"  as const,
    bullets: ["Traditional Maasai village visit", "Lavish farewell lunch in Nairobi"] },
];

/* ── Stack card ── */
function StackCard({
  day, index, activeIndex, activeValue, isMobile,
}: {
  day: (typeof DAYS)[number];
  index: number;
  activeIndex: MotionValue<number>;
  activeValue: number;
  isMobile: boolean;
}) {
  const isLeft = day.side === "left";
  // Only promote to GPU layer when within 2 cards of active — saves compositing budget
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
    return TILTS[index] * t;
  });

  const scale = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos >  1)    return 0.86;
    if (pos >  0)    return 0.86 + (1 - pos) * 0.16;
    if (pos > -0.15) return 1.02 - Math.abs(pos) / 0.15 * 0.02;
    return 1.0;
  });

  const opacity = useTransform(activeIndex, (a) => {
    const pos   = index - a;
    const depth = -pos;
    if (pos >  1.2) return 0;
    if (depth > 5)  return Math.max(0, 1 - (depth - 5) * 0.4);
    return 1;
  });

  // Single combined transform — eliminates the second nested motion.div
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
        {/* Photo */}
        <Image src={day.image} alt="" fill sizes="(max-width: 640px) calc(85vw - 27px), 500px" className="object-cover object-center" priority={index === 0} />

        {/* Bottom scrim only — for text contrast */}
        <div className="absolute bottom-0 inset-x-0 h-[70%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)" }} />


        {/* TOP: Day number + date */}
        <div className={`absolute top-5 ${isLeft ? "left-5" : "right-5"} flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
          <span
            className="font-black leading-none tracking-tighter"
            style={{ fontSize: "clamp(2.8rem, 9vh, 4.5rem)", color: ACCENT }}
          >
            {String(day.day).padStart(2, "0")}
          </span>
          <span className="text-[12px] font-bold tracking-[0.28em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
            {day.date}
          </span>
        </div>

        {/* BOTTOM: text panel */}
        <div className={`absolute bottom-0 left-0 right-0 px-5 pb-6 pt-10 ${isLeft ? "" : "text-right"}`}>
          <p className="text-[12px] font-bold tracking-[0.25em] uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.65)" }}>
            {day.location}
          </p>
          <h3
            className="font-black leading-[1.1] text-white mb-3"
            style={{ fontSize: "clamp(1.5rem, 5vh, 2rem)", textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
          >
            {day.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: ACCENT }} className="italic">
              {day.title.split(" ").slice(-1)[0]}
            </span>
          </h3>
          <div className="mb-4 h-px w-12" style={{ background: `${ACCENT}80`, marginLeft: isLeft ? 0 : "auto" }} />
          <ul className={`space-y-2.5 ${isLeft ? "" : "flex flex-col items-end"}`}>
            {day.bullets.map((b, j) => (
              <li key={j} className={`flex items-center gap-3 text-[13px] font-medium ${isLeft ? "" : "flex-row-reverse"}`}
                style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
                <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Slim amber progress bar ── */
function ProgressBar({ activeIndex, total }: { activeIndex: MotionValue<number>; total: number }) {
  const scaleX = useTransform(activeIndex, [0, total - 1], [0, 1]);
  return (
    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/8 z-[60]">
      <motion.div className="h-full origin-left" style={{ scaleX, background: ACCENT }} />
    </div>
  );
}

/* ── Simple CSS-transition dots — no MotionValues ── */
function Dots({ activeIndex, total }: { activeIndex: MotionValue<number>; total: number }) {
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(activeIndex, "change", (v) => setCurrent(Math.round(v)));
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-[6px] z-[60]">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-[4px] rounded-full transition-all duration-300"
          style={{ width: i === current ? 20 : 5, opacity: i === current ? 1 : 0.28, background: ACCENT }} />
      ))}
    </div>
  );
}

/* ── Root ── */
export default function KenyaScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, DAYS.length - 0.001]);

  const isMobile = useIsMobile();

  // Track active index as a plain number for windowing + willChange gating
  const [activeValue, setActiveValue] = useState(0);

  useMotionValueEvent(activeIndex, "change", (v) => {
    setActiveValue(Math.round(v));
  });

  return (
    <div ref={containerRef} style={{ height: `${DAYS.length * SCROLL_PER_CARD}vh` }} className="relative">
      <div className="sticky top-0 h-[100dvh] overflow-hidden" style={{ contain: "strict", willChange: "transform", transform: "translateZ(0)" }}>

        {/* Background — static gradient orbs (no animation = no GPU cost) + starfield */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 55% 50% at 8% 55%, rgba(255,107,53,0.32) 0%, rgba(255,107,53,0.10) 45%, transparent 70%),
            radial-gradient(ellipse 50% 55% at 65% 10%, rgba(0,230,118,0.26) 0%, rgba(0,230,118,0.08) 45%, transparent 70%),
            radial-gradient(ellipse 45% 50% at 45% 40%, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0.07) 45%, transparent 70%),
            #0a0a0a
          `
        }}>
          {!isMobile && <StarfieldCanvas opacity={0.45} />}

          {/* Noise grain */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat", backgroundSize: "128px",
          }} />
        </div>

        {/* Sticky header */}
        <div className="absolute top-16 inset-x-0 z-[70] flex flex-col items-center pointer-events-none">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: ACCENT }}>
            Day-by-Day
          </p>
          <h2 className="text-2xl sm:text-3xl font-black leading-none text-white">
            The <span className="italic" style={{ color: ACCENT }}>Journey</span>
          </h2>
        </div>

        {/* Card deck — only render cards within the window to reduce DOM + layer count */}
        <div className="absolute inset-0">
          {DAYS.map((day, i) => {
            if (Math.abs(i - activeValue) > RENDER_WINDOW) return null;
            return (
              <StackCard key={day.day} day={day} index={i} activeIndex={activeIndex} activeValue={activeValue} isMobile={isMobile} />
            );
          })}
        </div>

        <ProgressBar activeIndex={activeIndex} total={DAYS.length} />
        <Dots        activeIndex={activeIndex} total={DAYS.length} />
      </div>
    </div>
  );
}
