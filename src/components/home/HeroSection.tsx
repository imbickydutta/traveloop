"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

const DESTINATIONS = ["Thailand", "Egypt", "Bali", "Kenya", "Maldives", "Japan"];
const TYPE_MS   = 110;
const DELETE_MS = 65;
const PAUSE_MS  = 1800;

function TypewriterPlace() {
  const [text, setText]       = useState("");
  const [deleting, setDelete] = useState(false);
  const [idx, setIdx]         = useState(0);

  useEffect(() => {
    const word = DESTINATIONS[idx];
    if (!deleting) {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setDelete(true), PAUSE_MS);
      return () => clearTimeout(t);
    }
    if (text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS);
      return () => clearTimeout(t);
    }
    setDelete(false);
    setIdx((i) => (i + 1) % DESTINATIONS.length);
  }, [text, deleting, idx]);

  return (
    <span className="italic text-[#ff6b35]">
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.7, repeat: Infinity }}
        className="ml-0.5"
      >|</motion.span>
    </span>
  );
}

const HERO_IMAGES = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden snap-start">
      {/* ── Crossfading background images — render all, show active ── */}
      {HERO_IMAGES.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </motion.div>
      ))}

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 sm:px-6 text-center pt-[145px] sm:pt-[200px] md:pt-[220px]">

        {/* Product description */}
        <motion.p
          className="text-[10px] sm:text-sm font-semibold tracking-[0.22em] uppercase text-white/70 mb-3 sm:mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Curated group trips · Zero planning stress
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
        >
          Plan your next trip to<br />
          <span className="inline-block min-h-[1.2em] min-w-[4ch]"><TypewriterPlace /></span>
        </motion.h1>

        {/* Benefit pills — single row on mobile */}
        <motion.div
          className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {["✦ Itineraries", "✦ Group Deals", "✦ Expert-Led"].map((pill) => (
            <span
              key={pill}
              className="text-[10px] sm:text-xs font-semibold tracking-wide text-white/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          {[
            { value: "500+", label: "Travellers" },
            { value: "12",   label: "Destinations" },
            { value: "4.9★", label: "Rated" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-base sm:text-lg font-black text-white leading-none">{value}</span>
              <span className="text-[10px] sm:text-xs text-white/45 tracking-wider uppercase mt-0.5">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs — side by side on mobile */}
        <motion.div
          className="mt-auto flex flex-row items-center gap-3 mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            href="/#lineup"
            className="group relative inline-flex items-center gap-1.5 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-bold text-xs sm:text-sm tracking-widest uppercase px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]"
          >
            Upcoming Trips
            <ArrowRight size={16} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/curated"
            className="inline-flex items-center gap-1.5 border border-white/30 hover:border-white/70 text-white font-bold text-xs sm:text-sm tracking-widest uppercase px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
          >
            Plan My Vibe
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="relative z-10 flex flex-col items-center pb-5 sm:pb-8 gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[9px] tracking-[0.2em] uppercase text-white/40">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

