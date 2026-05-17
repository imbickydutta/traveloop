"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BRAND_GOLD = "#e8b84b";

export default function ExploreAllTripsCTA() {
  return (
    <section className="relative h-[100dvh] sm:min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden snap-start px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <p
          className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3"
          style={{ color: BRAND_GOLD }}
        >
          More Where That Came From
        </p>
        <h2 className="font-script font-bold text-white text-3xl sm:text-5xl leading-none mb-5">
          See every trip,{" "}
          <span className="italic" style={{ color: BRAND_GOLD }}>
            filter your way.
          </span>
        </h2>
        <p className="text-white/40 text-sm sm:text-base mb-8">
          Sort by vibe, budget, month — find the one that fits.
        </p>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-[0.12em] uppercase transition-all duration-200 hover:bg-white/5"
          style={{
            border: `1px solid ${BRAND_GOLD}`,
            color: BRAND_GOLD,
          }}
        >
          Explore All Trips
          <span aria-hidden>→</span>
        </Link>
      </motion.div>
    </section>
  );
}
