"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import TalkToUsModal from "@/components/home/TalkToUsModal";
import PlanTripModal from "@/components/home/PlanTripModal";
import Ticker from "@/components/shared/Ticker";
import type { Trip } from "@/types/trip";

const BRAND_GOLD = "#e8b84b";

interface Props {
  initialTrips: Trip[];
  initialTotal: number;
}

function matchesQuery(trip: Trip, query: string): boolean {
  const haystack = [trip.name, trip.destination, ...trip.attractions]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function TripsBrowser({ initialTrips, initialTotal }: Props) {
  const [modalTrip, setModalTrip] = useState<Trip | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const filteredTrips = useMemo(() => {
    if (!trimmedQuery) return initialTrips;
    return initialTrips.filter((trip) => matchesQuery(trip, trimmedQuery));
  }, [initialTrips, trimmedQuery]);

  return (
    <div className="pt-20 sm:pt-24 pb-16">
      {/* Page header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: BRAND_GOLD }}
          >
            All Trips
          </p>
          <Link
            href="/trips/calendar"
            className="text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white transition-colors"
          >
            Calendar view →
          </Link>
        </div>
        <h1 className="font-script font-bold text-white text-4xl sm:text-6xl leading-none mb-4">
          Find Your{" "}
          <span className="italic" style={{ color: BRAND_GOLD }}>
            Next Adventure
          </span>
        </h1>
        <p className="text-white/40 text-sm sm:text-base mb-6">
          {initialTotal} {initialTotal === 1 ? "trip" : "trips"} available
        </p>

        {/* Search bar */}
        <div className="relative max-w-md">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a destination — Bali, Kenya, Egypt…"
            className="w-full text-sm text-white/90 rounded-xl pl-11 pr-10 py-3 outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              caretColor: BRAND_GOLD,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${BRAND_GOLD}55`;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND_GOLD}15`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredTrips.length === 0 ? (
          trimmedQuery ? (
            <SearchEmptyState
              query={trimmedQuery}
              onCustomise={() => setPlanModalOpen(true)}
            />
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onTalk={() => setModalTrip(trip)}
              />
            ))}
          </div>
        )}
      </section>

      {modalTrip && (
        <TalkToUsModal
          trip={modalTrip}
          source="talk_to_us"
          onClose={() => setModalTrip(null)}
        />
      )}

      {planModalOpen && (
        <PlanTripModal
          initialQuery={trimmedQuery}
          onClose={() => setPlanModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Trip card ─────────────────────────── */

function TripCard({ trip, onTalk }: { trip: Trip; onTalk: () => void }) {
  const accent = trip.accentColor;
  const tickerItems = [
    ...trip.attractions,
    trip.durationShort,
    ...(trip.seatsLeft != null ? [`${trip.seatsLeft} seats left`] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#121212",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px ${accent}10`,
      }}
    >
      {/* Hero image */}
      <div className="relative h-[240px] overflow-hidden">
        {trip.images[0] && (
          <Image
            src={trip.images[0]}
            alt={trip.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Status badge top-left */}
        {trip.status !== "available" && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
              style={{
                background: `${accent}22`,
                color: accent,
                border: `1px solid ${accent}44`,
              }}
            >
              {trip.status === "filling-fast" ? "Filling Fast" : "Sold Out"}
            </span>
          </div>
        )}

        {/* Seats-left badge top-right */}
        {trip.seatsLeft != null &&
          trip.seatsLeft < 8 &&
          trip.status !== "sold-out" && (
            <div className="absolute top-3 right-3">
              <span
                className="text-[10px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {trip.seatsLeft} seats left
              </span>
            </div>
          )}
      </div>

      {/* Info */}
      <div className="px-5 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{trip.flag}</span>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/40">
            {trip.destination}
          </p>
        </div>

        <h3 className="font-script font-bold text-white text-2xl sm:text-3xl leading-tight">
          {trip.name}
        </h3>

        {/* Dates + duration pills */}
        <div className="flex flex-wrap gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: `${accent}14`,
              color: accent,
              border: `1px solid ${accent}33`,
            }}
          >
            {trip.dateDisplay}
          </span>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {trip.durationShort}
          </span>
        </div>

        {/* Ticker */}
        <div
          className="rounded-lg py-2 mt-1"
          style={{ background: `${accent}0c`, border: `1px solid ${accent}1e` }}
        >
          <Ticker items={tickerItems} accent={accent} />
        </div>

        {/* Price */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
            Per person
          </p>
          <p
            className="font-script font-bold text-2xl mt-0.5"
            style={{ color: accent }}
          >
            ₹{trip.pricePerPaxINR.toLocaleString("en-IN")}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 mt-2">
          <Link
            href={`/trips/${trip.slug}`}
            className="flex-1 text-center py-3 rounded-xl font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}44`,
              color: "#fff",
            }}
          >
            Itinerary
          </Link>
          <button
            type="button"
            onClick={onTalk}
            className="flex-1 py-3 rounded-xl font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
            style={{
              background: "#25d366",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            }}
          >
            Talk to Us
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Empty states ─────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24 gap-4">
      <div className="text-5xl">✈️</div>
      <h3 className="text-white font-bold text-xl">No trips available right now</h3>
      <p className="text-white/40 text-sm">Check back soon — new trips are added regularly</p>
    </div>
  );
}

function SearchEmptyState({
  query,
  onCustomise,
}: {
  query: string;
  onCustomise: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24 gap-4">
      <div className="text-5xl">🗺️</div>
      <h3 className="text-white font-bold text-xl">
        We don&rsquo;t have &ldquo;{query}&rdquo; listed yet
      </h3>
      <p className="text-white/40 text-sm max-w-xs">
        We can still put together a custom trip there — just tell us a bit more.
      </p>
      <button
        type="button"
        onClick={onCustomise}
        className="mt-2 px-6 py-3 rounded-xl font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
        style={{ background: BRAND_GOLD, color: "#000" }}
      >
        Request a Custom Trip
      </button>
    </div>
  );
}
