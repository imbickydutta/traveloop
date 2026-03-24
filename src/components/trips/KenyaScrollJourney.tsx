"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";

const ACCENT  = "#f5a623";
const SCROLL_PER_CARD = 90; // vh of scroll space per card

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

/* ── Blurred background — crossfades between card images ── */
function BgImage({ src, index, activeIndex }: { src: string; index: number; activeIndex: MotionValue<number> }) {
  const opacity = useTransform(
    activeIndex,
    [index - 0.9, index - 0.3, index, index + 0.3, index + 0.9],
    [0, 0.7, 1, 0.7, 0]
  );
  const scale = useTransform(activeIndex, [index - 1, index, index + 1], [1.06, 1.12, 1.06]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" style={{ filter: "blur(28px)" }} priority={index === 0} />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   StackCard

   Journey of every card as activeIndex increases:
   1. Waiting below the screen  (pos > 1)
   2. Peeking up from the bottom  (pos ≈ 1 → 0.1)
   3. Sliding onto the stack, straight on top  (pos ≈ 0)
   4. Tilting into its resting position as the NEXT card arrives  (pos < 0)
   5. Staying put — never leaves the stack
──────────────────────────────────────────────────────────────── */
function StackCard({
  day, index, activeIndex,
}: {
  day: (typeof DAYS)[number];
  index: number;
  activeIndex: MotionValue<number>;
}) {
  const isLeft = day.side === "left";

  /* Y: come up from below → land at 0 → never move again */
  const y = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos >  1.2) return "78vh";
    if (pos >  0)   return `${pos * 60}vh`;
    return "0vh";
  });

  /*
    Rotate:
    • While approaching & on top: 0° (straight, fully readable)
    • As the NEXT card slides on top: smoothly tilts to TILTS[index]
    • Stays at that tilt forever
  */
  const rotate = useTransform(activeIndex, (a) => {
    const pos = index - a;        // 0 = just landed, negative = buried
    if (pos > -0.05) return 0;    // on top or arriving: perfectly straight
    const t = Math.min(1, (Math.abs(pos) - 0.05) / 0.9);
    return TILTS[index] * t;
  });

  /* Brief scale overshoot as card lands — feels snappy and physical */
  const scale = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos >  1)    return 0.86;
    if (pos >  0)    return 0.86 + (1 - pos) * 0.16; // 0.86 → 1.02
    if (pos > -0.15) return 1.02 - Math.abs(pos) / 0.15 * 0.02; // 1.02 → 1.0
    return 1.0;
  });

  /* Opacity: invisible far away; clear while peeking; solid in stack */
  const opacity = useTransform(activeIndex, (a) => {
    const pos   = index - a;
    const depth = -pos;           // how deep in the stack (0 = top)
    if (pos >  1.2) return 0;
    if (pos >  0)   return Math.max(0, 1 - pos * 0.6);
    if (depth > 5)  return Math.max(0, 1 - (depth - 5) * 0.4); // fade very old cards
    return 1;
  });

  /* z-index is CONSTANT — each card always sits above earlier cards */
  const zIndex = index + 1;

  /* Blurred background crossfade opacity on THIS card's image layer */
  const bgOpacity = useTransform(activeIndex, (a) => {
    const pos = index - a;
    if (pos > 0.2 || pos < -0.6) return 0;
    if (pos > 0) return 1 - pos / 0.2;
    return 1 + pos / 0.6;
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ y, zIndex }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "min(calc(100vw - 32px), 500px)",
          height: "58vh",
          rotate,
          scale,
          opacity,
          /* Shadow intensifies with the amber glow — feels luxurious */
          willChange: "transform",
        boxShadow: `
            0 40px 90px rgba(0,0,0,0.75),
            0 12px 28px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.06)
          `,
        }}
      >
        {/* Photo */}
        <Image src={day.image} alt="" fill sizes="(max-width: 768px) calc(100vw - 32px), 500px" className="object-cover object-center" priority={index === 0} />

        {/* Darkening layers */}
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0"
          style={{
            background: isLeft
              ? "linear-gradient(100deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 80%)"
              : "linear-gradient(260deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 80%)",
          }}
        />
        {/* Bottom scrim for the glass footer */}
        <div className="absolute bottom-0 inset-x-0 h-[55%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />

        {/* ── TOP: Day number + date ──────────────────── */}
        <div className={`absolute top-5 ${isLeft ? "left-5" : "right-5"} flex flex-col ${isLeft ? "items-start" : "items-end"}`}>
          {/* Day number in elegant large numeral */}
          <span
            className="font-black leading-none tracking-tighter"
            style={{ fontSize: "clamp(2.2rem, 7vh, 3.5rem)", color: ACCENT, opacity: 0.95 }}
          >
            {String(day.day).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/40 mt-0.5">
            {day.date}
          </span>
        </div>

        {/* Thin amber rule — runs across the card width at the accent edge */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            [isLeft ? "left" : "right"]: "0",
            background: `linear-gradient(to bottom, transparent 10%, ${ACCENT}90 40%, ${ACCENT}90 60%, transparent 90%)`,
          }}
        />

        {/* ── BOTTOM: frosted glass text panel ─────── */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10 ${isLeft ? "" : "text-right"}`}
          style={{
            backdropFilter: "blur(0px)", // pure gradient, no blur (blur causes perf issues on stacked cards)
          }}
        >
          {/* Location */}
          <p className="text-[9px] font-semibold tracking-[0.32em] uppercase text-white/35 mb-2">
            {day.location}
          </p>

          {/* Title */}
          <h3
            className="font-black leading-[1.1] text-white mb-3"
            style={{ fontSize: "clamp(1.15rem, 3.5vh, 1.5rem)" }}
          >
            {day.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: ACCENT }} className="italic">
              {day.title.split(" ").slice(-1)[0]}
            </span>
          </h3>

          {/* Thin divider */}
          <div className="mb-3 h-px w-10" style={{ background: `${ACCENT}55`, marginLeft: isLeft ? 0 : "auto" }} />

          {/* Bullets */}
          <ul className={`space-y-1.5 ${isLeft ? "" : "flex flex-col items-end"}`}>
            {day.bullets.map((b, j) => (
              <li key={j} className={`flex items-start gap-2 text-[11px] text-white/50 ${isLeft ? "" : "flex-row-reverse"}`}>
                <span className="mt-[3px] w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
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

/* ── Pill dots ── */
function Dots({ activeIndex, total }: { activeIndex: MotionValue<number>; total: number }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-[6px] z-[60]">
      {Array.from({ length: total }).map((_, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const w  = useTransform(activeIndex, [i - 0.5, i, i + 0.5], [5, 20, 5]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const op = useTransform(activeIndex, [i - 0.5, i, i + 0.5], [0.28, 1, 0.28]);
        return (
          <motion.div key={i} className="h-[4px] rounded-full" style={{ width: w, opacity: op, background: ACCENT }} />
        );
      })}
    </div>
  );
}

/* ── Root ── */
export default function KenyaScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, DAYS.length - 0.001]);

  return (
    <div ref={containerRef} style={{ height: `${DAYS.length * SCROLL_PER_CARD}vh` }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1000px", perspectiveOrigin: "50% 55%", contain: "paint layout", willChange: "transform" }}
      >
        {/* Blurred scene background */}
        <div className="absolute inset-0 bg-[#060606]">
          {DAYS.map((d, i) => <BgImage key={i} src={d.image} index={i} activeIndex={activeIndex} />)}
          <div className="absolute inset-0 bg-black/48" />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 25%, rgba(0,0,0,0.6) 100%)"
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

        {/* Card deck */}
        <div className="absolute inset-0">
          {DAYS.map((day, i) => (
            <StackCard key={day.day} day={day} index={i} activeIndex={activeIndex} />
          ))}
        </div>

        <ProgressBar activeIndex={activeIndex} total={DAYS.length} />
        <Dots        activeIndex={activeIndex} total={DAYS.length} />
      </div>
    </div>
  );
}
