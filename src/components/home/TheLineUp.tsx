"use client";

import { motion, type Variants } from "framer-motion";
import { TRIPS } from "@/data/trips";
import TripsCarousel from "./TripsCarousel";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";


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
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: -1,
        background: `
          radial-gradient(ellipse 55% 50% at 8% 55%, rgba(255,107,53,0.32) 0%, rgba(255,107,53,0.10) 45%, transparent 70%),
          radial-gradient(ellipse 50% 55% at 65% 10%, rgba(0,230,118,0.26) 0%, rgba(0,230,118,0.08) 45%, transparent 70%),
          radial-gradient(ellipse 45% 50% at 45% 40%, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0.07) 45%, transparent 70%),
          #0a0a0a
        `
      }} aria-hidden>
        <StarfieldCanvas opacity={0.45} />

        {/* Noise grain */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "128px",
        }} />
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
