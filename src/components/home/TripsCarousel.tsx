"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Trip } from "@/types/trip";
import TripTicketCard from "./TripTicketCard";

interface Props {
  trips: Trip[];
}

interface Dims {
  activeW: number; // active card width
  sideW: number;   // side peek card width
  spacing: number; // center-to-center distance
}

/**
 * Returns layout dimensions based on current viewport width.
 * Active card grows generously on large screens; side cards stay compact.
 */
function getDims(vw: number): Dims {
  if (vw >= 1280) return { activeW: 620, sideW: 268, spacing: 476 };
  if (vw >= 1024) return { activeW: 520, sideW: 264, spacing: 414 };
  if (vw >= 768)  return { activeW: 420, sideW: 255, spacing: 366 };
  // Mobile: fill most of the screen width, no side peek needed
  return { activeW: Math.min(340, vw - 48), sideW: 220, spacing: 300 };
}

/** x translation (from left:50%) to position a card at a given carousel offset */
function cardX(offset: number, d: Dims): number {
  if (offset === 0) return -(d.activeW / 2);
  return offset * d.spacing - d.sideW / 2;
}

export default function TripsCarousel({ trips }: Props) {
  const [active, setActive] = useState(0);
  const [dims, setDims] = useState<Dims>({ activeW: 360, sideW: 260, spacing: 334 });
  const pauseUntil = useRef(0);

  const pointerStartX = useRef(0);
  const didDrag = useRef(false);

  // Recompute on mount and on resize
  useEffect(() => {
    const update = () => setDims(getDims(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-scroll every 5 seconds — pauses for 10s after any user interaction
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setActive((a) => (a + 1) % trips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trips.length]);

  const n = trips.length;
  const goTo = (i: number) => {
    pauseUntil.current = Date.now() + 10000;
    setActive(((i % n) + n) % n);
  };

  /** Circular offset: wraps so adjacent items always show on both sides */
  const circOffset = (index: number) => {
    const raw  = index - active;
    const half = n / 2;
    if (raw >  half) return raw - n;
    if (raw < -half) return raw + n;
    return raw;
  };

  /* ── Swipe / drag ── */
  const onPointerDown = (e: React.PointerEvent) => {
    pauseUntil.current = Date.now() + 10000;
    pointerStartX.current = e.clientX;
    didDrag.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - pointerStartX.current) > 8) didDrag.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const delta = pointerStartX.current - e.clientX;
    if (Math.abs(delta) > 50) delta > 0 ? goTo(active + 1) : goTo(active - 1);
  };

  return (
    <div className="select-none">
      {/* ── Card stage ── */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 506, touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {trips.map((trip, index) => {
          const offset     = circOffset(index);
          const isActive   = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;

          if (Math.abs(offset) > 1) return null;

          return (
            <motion.div
              key={trip.id}
              className="absolute overflow-hidden"
              style={{
                left: "50%",
                top: 8,
                zIndex: isActive ? 10 : isAdjacent ? 5 : 1,
              }}
              initial={{
                x: offset > 0
                  ? cardX(offset, dims) + dims.spacing   // enter from off-screen right
                  : offset < 0
                  ? cardX(offset, dims) - dims.spacing   // enter from off-screen left
                  : cardX(0, dims),
                scale: 0.9,
                opacity: 0,
                width: dims.sideW,
                height: 260,
              }}
              animate={{
                x: cardX(offset, dims),
                scale: isActive ? 1 : 0.9,
                opacity: isActive ? 1 : isAdjacent ? 0.5 : 0,
                width: isActive ? dims.activeW : dims.sideW,
                height: isActive ? 490 : 260,
              }}
              transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => {
                if (!didDrag.current && isAdjacent) goTo(index);
              }}
            >
              <AnimatePresence initial={false}>
                {isActive ? (
                  <motion.div
                    key={`${trip.id}-active`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeInOut" } }}
                    transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
                  >
                    <TripTicketCard trip={trip} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${trip.id}-side`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                    transition={{ delay: 0.3, duration: 0.35, ease: "easeOut" }}
                  >
                    <SideCard trip={trip} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Controls: prev · dots · next ── */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <NavButton
          direction="left"
          disabled={false}
          onClick={() => goTo(active - 1)}
        />

        <div className="flex items-center gap-2">
          {trips.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to trip ${i + 1}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                height: 6,
                width: i === active ? 22 : 6,
                backgroundColor:
                  i === active
                    ? trips[active].accentColor
                    : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        <NavButton
          direction="right"
          disabled={false}
          onClick={() => goTo(active + 1)}
        />
      </div>
    </div>
  );
}

/* ── Side peek card ── */
function SideCard({ trip }: { trip: Trip }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[#181818] border border-white/[0.08]"
      style={{ width: "100%", height: 260 }}
    >
      <Image
        src={trip.images[0]}
        alt={trip.name}
        fill
        className="object-cover"
        sizes="300px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <p className="text-white font-black text-sm tracking-[0.12em] uppercase leading-tight mb-1">
          {trip.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider">From</span>
          <span className="font-bold text-sm" style={{ color: trip.accentColor }}>
            ₹{(trip.pricePerPaxINR / 1000).toFixed(0)}k
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Arrow button ── */
function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous trip" : "Next trip"}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
    >
      {direction === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  );
}
