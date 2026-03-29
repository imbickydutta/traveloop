"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TalkToUsModal from "./TalkToUsModal";
import { TRIPS } from "@/data/trips";

const ACCENT = "#f5a623";
const KENYA  = TRIPS.find((t) => t.slug === "kenya-safari")!;

const IMAGES = [
  "/images/trips/kenya/kenya-3.jpg",
  "/images/trips/kenya/kenya-1.jpg",
  "/images/trips/kenya/kenya-4.webp",
  "/images/trips/kenya/kenya-2.jpg",
];

const TICKER_ITEMS = [
  "Big Five", "Masai Mara", "Amboseli", "Kilimanjaro",
  "Hell's Gate", "Lake Nakuru", "9 Days", "8 Nights", "4 Seats Left",
];

const ORBS = [
  {
    color: "#f5a623", size: 520, blur: 100, opacity: 0.22,
    top: "15%", left: "75%",
    animate: { x: [0, -55, 30, 0], y: [0, 65, -40, 0] }, duration: 26,
  },
  {
    color: "#e07b00", size: 420, blur: 90, opacity: 0.18,
    top: "80%", left: "15%",
    animate: { x: [0, 60, -30, 0], y: [0, -55, 35, 0] }, duration: 21,
  },
  {
    color: "#ff9100", size: 280, blur: 80, opacity: 0.12,
    top: "50%", left: "40%",
    animate: { x: [0, -40, 50, 0], y: [0, 40, -30, 0] }, duration: 17,
  },
];

/* ── Seamless rAF ticker ── */
function LocationTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const rafRef   = useRef<number | null>(null);

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
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", onVis);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex items-center will-change-transform whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 pr-2.5">
            <span
              className="text-[10px] font-black tracking-[0.22em] uppercase"
              style={{ color: ACCENT }}
            >
              {item}
            </span>
            <span style={{ color: `${ACCENT}55`, fontSize: 5 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Crossfade image slideshow ── */
function KenyaSlideshow() {
  const [current, setCurrent] = useState(0);
  const [loaded,  setLoaded]  = useState(() => new Set([0]));

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => {
        const next = (p + 1) % IMAGES.length;
        setLoaded((prev) => new Set([...prev, next]));
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {IMAGES.map((src, i) => {
        if (!loaded.has(i)) return null;
        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Image
              src={src} alt="" fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={i === 0}
            />
          </motion.div>
        );
      })}
    </>
  );
}

export default function KenyaSpotlight() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="kenya"
      className="relative bg-[#060606] h-screen flex items-center overflow-hidden snap-start"
    >
      {/* Ambient orbs — more vibrant */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size, height: orb.size,
              top: orb.top, left: orb.left,
              background: orb.color, opacity: orb.opacity,
              filter: `blur(${orb.blur}px)`,
              translateX: "-50%", translateY: "-50%",
            }}
            animate={orb.animate}
            transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-bold tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT }}
        >
          Featured Trip
        </motion.p>

        {/* Card — fixed height so it fits in one screen */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden"
          style={{
            height: "clamp(460px, 62vh, 560px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,165,0,0.12)",
          }}
        >
          {/* ── Left: Slideshow ── */}
          <div className="relative overflow-hidden h-[200px] lg:h-full">
            <KenyaSlideshow />

            {/* Base scrim */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Warm color glow bleeding rightward into panel */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background: "linear-gradient(to right, transparent 45%, rgba(245,166,35,0.08) 75%, #0e0a04 100%)",
              }}
            />
            {/* Mobile: downward fade */}
            <div
              className="absolute inset-0 lg:hidden"
              style={{ background: "linear-gradient(to bottom, transparent 35%, #0e0a04 100%)" }}
            />

            {/* Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span
                className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
              >
                Filling Fast · 4 seats left
              </span>
            </div>
          </div>

          {/* ── Right: Info panel — warm tint from image ── */}
          <div
            className="flex flex-col justify-between px-7 sm:px-9 py-7 sm:py-8 overflow-hidden"
            style={{
              /* Warm amber bleeds in from the left (image side) */
              background: "linear-gradient(135deg, #110d04 0%, #0c0c0c 50%, #0a0a0a 100%)",
              borderLeft: `1px solid rgba(245,166,35,0.15)`,
            }}
          >
            {/* Top */}
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Kenya, Africa
              </p>

              <h2
                className="font-script font-bold text-white leading-none mb-1.5"
                style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)" }}
              >
                Kenya{" "}
                <span className="italic" style={{ color: ACCENT }}>Safari</span>
              </h2>

              <p className="text-[13px] text-white/40 mb-5">
                05 – 13 Jun &nbsp;·&nbsp; 9 Days &nbsp;·&nbsp; 8 Nights
              </p>

              {/* Ticker strip */}
              <div
                className="rounded-lg py-2.5 mb-5"
                style={{ background: `${ACCENT}0c`, border: `1px solid ${ACCENT}20` }}
              >
                <LocationTicker />
              </div>

              <div className="h-px w-full mb-5" style={{ background: "rgba(255,255,255,0.07)" }} />

              {/* Price */}
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Per Pax
                </p>
                <p className="font-script font-bold" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)", color: ACCENT }}>
                  ₹65,000
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mt-4">
              <Link
                href="/trips/kenya-safari"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-300"
                style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44`, color: "#fff" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${ACCENT}30`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${ACCENT}25`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${ACCENT}18`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Itinerary
              </Link>

              <button
                onClick={() => setModalOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
                style={{ background: "#25d366", color: "#fff", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
              >
                <WhatsAppDot />
                Talk to Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {modalOpen && <TalkToUsModal trip={KENYA} onClose={() => setModalOpen(false)} />}
    </section>
  );
}

function WhatsAppDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="hidden sm:inline-flex animate-ping absolute h-full w-full rounded-full bg-white opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
    </span>
  );
}
