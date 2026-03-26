"use client";

import { motion, type Variants } from "framer-motion";
import { TRIPS } from "@/data/trips";
import TripsCarousel from "./TripsCarousel";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";

/* ── Orb config — each drifts on its own infinite keyframe path ── */
const ORBS = [
  {
    color: "#ff6b35",
    size: 520,
    blur: 120,
    opacity: 0.13,
    top: "55%",
    left: "8%",
    animate: { x: [0, 70, -30, 50, 0], y: [0, -90, 60, -40, 0] },
    duration: 22,
  },
  {
    color: "#00e676",
    size: 440,
    blur: 100,
    opacity: 0.10,
    top: "10%",
    left: "65%",
    animate: { x: [0, -60, 40, -20, 0], y: [0, 80, -50, 60, 0] },
    duration: 28,
  },
  {
    color: "#7c3aed",
    size: 380,
    blur: 110,
    opacity: 0.09,
    top: "40%",
    left: "45%",
    animate: { x: [0, 40, -60, 20, 0], y: [0, -40, 70, -30, 0] },
    duration: 19,
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.28, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

export default function TheLineUp() {
  return (
    <section id="lineup" className="relative h-screen sm:min-h-screen sm:py-28 flex flex-col justify-center overflow-hidden pt-16 pb-6 sm:py-28 snap-start">

      {/* ── Fixed background — persists into featured trips as you scroll ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }} aria-hidden>
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Starfield warp */}
        <StarfieldCanvas opacity={0.45} />

        {/* Ambient orbs */}
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              background: orb.color,
              opacity: orb.opacity,
              filter: `blur(${orb.blur}px)`,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={orb.animate}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          />
        ))}

        {/* Subtle noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
      </div>

      {/* ── All content staggered ── */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        {/* ── Section header ── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-4 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              {/* Desktop: label above heading */}
              <motion.p
                variants={item}
                className="hidden sm:block text-xs font-semibold tracking-[0.25em] uppercase text-[#00e676] mb-3"
              >
                Upcoming Trips
              </motion.p>
              <motion.h2
                variants={item}
                className="flex items-baseline gap-3 sm:block text-3xl sm:text-6xl font-black text-white leading-none tracking-tight"
              >
                {/* Mobile: "Upcoming Trips" sits inline beside heading */}
                <span className="sm:hidden text-xs font-semibold tracking-[0.25em] uppercase text-[#00e676] self-center">
                  Upcoming Trips
                </span>
                The{" "}
                <span className="italic text-[#ff6b35]">LineUp</span>
              </motion.h2>
            </div>

            <motion.div variants={item} className="hidden sm:block sm:text-right max-w-xs">
              <p className="text-base font-bold text-white leading-snug">
                Right place.{" "}
                <span className="text-[#ff6b35] italic">Right time.</span>
              </p>
              <p className="text-sm text-white/40 mt-1 leading-relaxed">
                All trips curated for maximum fun.<br />
                Pick one. We handle the rest.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Carousel ── */}
        <motion.div variants={item} className="relative overflow-hidden">
          <TripsCarousel trips={TRIPS} />
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          variants={item}
          className="hidden sm:flex relative max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-12 justify-center"
        >
          <a
            href="/trips"
            className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/60 hover:text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 hover:bg-white/5"
          >
            View all trips
            <span className="text-[#00e676]">→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
