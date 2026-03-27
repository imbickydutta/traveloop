"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TalkToUsModal from "./TalkToUsModal";
import { TRIPS } from "@/data/trips";
import { Trip } from "@/types/trip";

/* ── Seamless rAF ticker ── */
function Ticker({ items, accent }: { items: string[]; accent: string }) {
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

  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex items-center will-change-transform whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 pr-2.5">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: accent }}>
              {item}
            </span>
            <span style={{ color: `${accent}55`, fontSize: 5 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Crossfade slideshow ── */
function Slideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [loaded,  setLoaded]  = useState(() => new Set([0]));

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setCurrent((p) => {
        const next = (p + 1) % images.length;
        setLoaded((prev) => new Set([...prev, next]));
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => {
        if (!loaded.has(i)) return null;
        return (
          <motion.div
            key={src} className="absolute inset-0"
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Image
              src={src} alt="" fill className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority={i === 0}
            />
          </motion.div>
        );
      })}
    </>
  );
}

/* ── Shared card — always vertical layout ── */
function TripCard({
  trip,
  index,
  total,
  imageHeight = "h-[52%]",
}: {
  trip: Trip;
  index: number;
  total: number;
  imageHeight?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const accent = trip.accentColor;
  const rgb    = hexToRgb(accent);

  const tickerItems = [
    ...trip.attractions,
    trip.durationShort,
    ...(trip.seatsLeft != null ? [`${trip.seatsLeft} Seats Left`] : []),
  ];

  const displayPrice = trip.earlyBirdPercent
    ? Math.round(trip.pricePerPaxINR * (1 - trip.earlyBirdPercent / 100))
    : trip.pricePerPaxINR;

  const words    = trip.name.split(" ");
  const nameMain = words.slice(0, -1).join(" ");
  const nameLast = words.slice(-1)[0];

  const dParts    = trip.durationShort.split(" · ");
  const daysVal   = dParts[0]?.replace(/\D/g, "") ?? "—";
  const nightsVal = dParts[1]?.replace(/\D/g, "") ?? "—";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden"
        style={{ boxShadow: `0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px ${accent}18` }}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${imageHeight} shrink-0`}>
          <Slideshow images={trip.images} />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, transparent 40%, #0c0b09 100%)"
          }} />
          {trip.status !== "available" && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
                {trip.status === "filling-fast"
                  ? `Filling Fast · ${trip.seatsLeft} seats left`
                  : "Sold Out"}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div
          className="flex-1 min-h-0 flex flex-col justify-between px-5 py-3 sm:py-4 overflow-hidden"
          style={{
            background: `linear-gradient(140deg, rgba(${rgb},0.08) 0%, #0c0c0c 40%, #0a0a0a 100%)`,
            borderTop: `1px solid ${accent}14`,
          }}
        >
          {/* Top: title + ticker + stats + price */}
          <div className="flex flex-col gap-2 min-h-0">
            {/* Title row — date/duration fills whitespace on the right */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {trip.destination}
                </p>
                <h2 className="font-black text-white leading-[1.0] tracking-tight"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)" }}>
                  {nameMain}{" "}
                  <span className="italic" style={{ color: accent }}>{nameLast}</span>
                </h2>
              </div>
              <div className="text-right shrink-0 pt-1">
                <p className="text-[12px] font-bold text-white/60 leading-tight">{trip.dateDisplay}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{trip.durationShort}</p>
              </div>
            </div>

            {/* Ticker */}
            <div className="rounded-lg py-2.5 shrink-0"
              style={{ background: `${accent}0c`, border: `1px solid ${accent}1e` }}>
              <Ticker items={tickerItems} accent={accent} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden shrink-0"
              style={{ border: `1px solid ${accent}18` }}>
              {[
                { value: daysVal,   label: "Days"       },
                { value: nightsVal, label: "Nights"     },
                { value: trip.seatsLeft ?? "—", label: "Seats Left" },
              ].map((s, i) => (
                <div key={i}
                  className={`flex flex-col items-center py-2.5 ${i > 0 ? "border-l" : ""}`}
                  style={{ borderColor: `${accent}18` }}
                >
                  <span className="font-black text-white text-lg leading-none">{s.value}</span>
                  <span className="text-[9px] font-bold tracking-[0.15em] uppercase mt-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px w-full shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />

            {/* Price */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                Trip Price
              </p>
              <div className="flex items-baseline gap-3">
                <p className="font-black leading-none" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", color: accent }}>
                  {formatINR(displayPrice)}
                </p>
                {(trip.earlyBirdPercent ?? 0) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/30 line-through text-xs">{formatINR(trip.pricePerPaxINR)}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}>
                      -{trip.earlyBirdPercent}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tagline — hidden on mobile to prevent overflow */}
          <p className="hidden sm:block text-sm italic leading-snug text-white/40 px-0.5">
            &ldquo;{trip.tagline}&rdquo;
          </p>

          {/* CTAs */}
          <div className="flex gap-3 shrink-0">
            <Link
              href={`/trips/${trip.slug}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-300"
              style={{ background: `${accent}18`, border: `1px solid ${accent}44`, color: "#fff" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${accent}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${accent}25`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = `${accent}18`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Itinerary
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
              style={{ background: "#25d366", color: "#fff", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
            >
              <WhatsAppDot />
              Talk to Us
            </button>
          </div>
        </div>
      </motion.div>

      {modalOpen && <TalkToUsModal trip={trip} onClose={() => setModalOpen(false)} />}
    </>
  );
}

/* ── Mobile: one trip per full-screen snap section ── */
function TripSpotlight({ trip, index, total }: { trip: Trip; index: number; total: number }) {
  const accent = trip.accentColor;

  return (
    <section className="relative h-[100dvh] flex flex-col overflow-hidden snap-start lg:hidden">

      <div className="relative flex flex-col h-full w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[72px] pb-[env(safe-area-inset-bottom,20px)] sm:pb-6" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
        {/* Label row */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>
            Featured Trip
          </p>
          <p className="text-[11px] font-bold tracking-[0.2em] text-white/25">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <TripCard trip={trip} index={index} total={total} imageHeight="h-[45%]" />
      </div>
    </section>
  );
}

/* ── Desktop: two trips side-by-side in one full-screen snap section ── */
function DesktopTripPair({ pair, startIndex, total }: { pair: Trip[]; startIndex: number; total: number }) {
  return (
    <section className="hidden lg:flex h-[100dvh] snap-start overflow-hidden gap-6 px-6 pt-[72px] pb-6 justify-center">

      {pair.map((trip, i) => (
        <div key={trip.id} className="w-[30%] flex-shrink-0 flex flex-col">
          {/* Label row */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: trip.accentColor }}>
              Featured Trip
            </p>
            <p className="text-[11px] font-bold tracking-[0.2em] text-white/25">
              {String(startIndex + i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          </div>
          <TripCard trip={trip} index={startIndex + i} total={total} imageHeight="h-[38%]" />
        </div>
      ))}
    </section>
  );
}

export default function FeaturedTrips() {
  const pairs: Trip[][] = [];
  for (let i = 0; i < TRIPS.length; i += 2) {
    pairs.push(TRIPS.slice(i, i + 2));
  }

  return (
    <>
      {/* Mobile: one trip per snap section */}
      {TRIPS.map((trip, i) => (
        <TripSpotlight key={trip.id} trip={trip} index={i} total={TRIPS.length} />
      ))}

      {/* Desktop: two trips per snap section */}
      {pairs.map((pair, pi) => (
        <DesktopTripPair key={pi} pair={pair} startIndex={pi * 2} total={TRIPS.length} />
      ))}
    </>
  );
}

/* ── Helpers ── */
function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function WhatsAppDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
    </span>
  );
}
