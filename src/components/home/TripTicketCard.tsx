"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trip } from "@/types/trip";
import TalkToUsModal from "./TalkToUsModal";

interface Props {
  trip: Trip;
}

export default function TripTicketCard({ trip }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const earlyBirdPrice = trip.earlyBirdPercent
    ? Math.round(trip.pricePerPaxINR * (1 - trip.earlyBirdPercent / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full group"
    >
      {/* ── Ticket outer shell ── */}
      <div
        className="relative bg-[#181818] rounded-[20px] overflow-visible"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* ══════════════════════════════════
            TOP — Image slideshow
        ══════════════════════════════════ */}
        <div className="relative h-[320px] rounded-t-[20px] overflow-hidden">
          <ImageSlideshow images={trip.images} tripId={trip.id} />

          {/* Gradient: dark at top (for tags) and bottom (for name) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

          {/* Attraction tags — top left, right-24 reserves space for the status badge */}
          <div className="absolute top-3 left-4 right-24 flex flex-wrap gap-1.5 z-20">
            {trip.attractions.map((place) => (
              <span
                key={place}
                className="text-[10px] font-semibold text-white/90 px-2.5 py-1 rounded-full backdrop-blur-md"
                style={{
                  background: "rgba(0,0,0,0.40)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                {place}
              </span>
            ))}
          </div>

          {/* Status badge — top right */}
          {trip.status !== "available" && (
            <div className="absolute top-3 right-3 z-20">
              <StatusBadge status={trip.status} />
            </div>
          )}

          {/* Destination name — bottom left */}
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <p className="text-white font-black text-[28px] italic tracking-tight leading-none uppercase">
              {trip.name}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════
            PERFORATED TEAR LINE
        ══════════════════════════════════ */}
        <div className="relative h-0 flex items-center">
          <div className="absolute -left-[15px] w-[30px] h-[30px] rounded-full bg-[#0a0a0a] z-10" />
          <div className="absolute -right-[15px] w-[30px] h-[30px] rounded-full bg-[#0a0a0a] z-10" />
          <div className="w-full border-t border-dashed border-white/20 mx-5" />
        </div>

        {/* ══════════════════════════════════
            BOTTOM — Ticket body
        ══════════════════════════════════ */}
        <div className="px-5 pt-4 pb-4">

          {/* Row 1: DATES  |  PRICE */}
          <div className="flex items-start justify-between mb-4">
            {/* Dates */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/35 mb-1">
                Dates
              </p>
              <p className="text-[22px] font-black text-white leading-none tracking-tight">
                {trip.dateDisplay}
              </p>
              <p className="text-[11px] font-semibold text-white/40 mt-1.5 tracking-wider">
                {trip.durationShort}
              </p>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/35 mb-1">
                {earlyBirdPrice ? "Early Bird" : "Per Pax"}
              </p>
              <p
                className="text-[22px] font-black leading-none tracking-tight"
                style={{ color: trip.accentColor }}
              >
                {formatINR(earlyBirdPrice ?? trip.pricePerPaxINR)}
              </p>
              {earlyBirdPrice && (
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <span className="text-[11px] text-white/30 line-through">
                    {formatINR(trip.pricePerPaxINR)}
                  </span>
                  <span
                    className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{
                      color: trip.accentColor,
                      background: `${trip.accentColor}18`,
                      border: `1px solid ${trip.accentColor}30`,
                    }}
                  >
                    -{trip.earlyBirdPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.07] mb-4" />

          {/* ── Two action buttons ── */}
          <div className="flex gap-2.5">
            {/* Primary: Grab This Ticket */}
            <Link
              href={`/trips/${trip.slug}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = trip.accentColor + "20";
                el.style.borderColor = trip.accentColor + "55";
                el.style.boxShadow = `0 0 20px ${trip.accentColor}25`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#111";
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              <TicketIcon color={trip.accentColor} />
              Itinerary
            </Link>

            {/* Secondary: Talk to Us → opens WhatsApp modal */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
              style={{
                background: "#25d366",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
              }}
            >
              <WhatsAppDot />
              Talk to Us
            </button>
          </div>
        </div>
      </div>

      {/* ── WhatsApp modal ── */}
      {modalOpen && (
        <TalkToUsModal trip={trip} onClose={() => setModalOpen(false)} />
      )}
    </motion.div>
  );
}

/* ── Auto-advancing crossfade slideshow ── */
function ImageSlideshow({ images, tripId }: { images: string[]; tripId: string }) {
  const [current, setCurrent] = useState(0);
  // Track which indexes have been loaded so we never unmount a loaded image
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));

  // Reset when trip changes
  useEffect(() => {
    setCurrent(0);
    setLoaded(new Set([0]));
  }, [tripId]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(
      () => setCurrent((p) => {
        const next = (p + 1) % images.length;
        // Pre-load next slide
        setLoaded((prev) => new Set([...prev, next]));
        return next;
      }),
      3500
    );
    return () => clearInterval(t);
  }, [images.length, tripId]);

  const goTo = (i: number) => {
    setLoaded((prev) => new Set([...prev, i]));
    setCurrent(i);
  };

  const SIZES = "(min-width:1280px) 620px, (min-width:1024px) 520px, (min-width:768px) 420px, 340px";

  // This div clips the absolutely-positioned motion.divs so they respect
  // the parent's border-radius even during GPU-composited opacity transitions.
  return (
    <div className="absolute inset-0 rounded-t-[20px] overflow-hidden">
      {images.map((src, i) => {
        if (!loaded.has(i)) return null;
        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes={SIZES}
              priority={i === 0}
            />
          </motion.div>
        );
      })}

      {/* Slide indicators — sit above the name, bottom-right */}
      {images.length > 1 && (
        <div className="absolute bottom-12 right-4 flex gap-1 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Image ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                height: 3,
                width: i === current ? 18 : 4,
                background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */
function formatINR(amount: number): string {
  // Format as Indian numbering: ₹1,25,000
  return "₹" + amount.toLocaleString("en-IN");
}

function StatusBadge({ status }: { status: Trip["status"] }) {
  const config = {
    "filling-fast": { label: "Filling Fast", color: "#ff6b35" },
    "sold-out": { label: "Sold Out", color: "#ef4444" },
    available: { label: "", color: "" },
  };
  const c = config[status];
  if (!c.label) return null;

  return (
    <span
      className="text-[9px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
      style={{
        backgroundColor: `${c.color}22`,
        color: c.color,
        border: `1px solid ${c.color}44`,
      }}
    >
      {c.label}
    </span>
  );
}

function WhatsAppDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
    </span>
  );
}

function TicketIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ color }}>
      <path
        d="M2 9a1 1 0 011-1h1a2 2 0 100-4H3a1 1 0 01-1-1V3a1 1 0 011-1h18a1 1 0 011 1v4a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-4a1 1 0 011-1h1a2 2 0 100-4H3a1 1 0 01-1-1V9z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
