"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import TalkToUsModal from "@/components/home/TalkToUsModal";
import Ticker from "@/components/shared/Ticker";
import { fetchTrips, type TripFilters } from "@/lib/api/trips";
import type { Trip } from "@/types/trip";

const BRAND_GOLD = "#e8b84b";

const TRAVELLER_OPTIONS = [
  { value: "all",    label: "All"    },
  { value: "solo",   label: "Solo"   },
  { value: "couple", label: "Couple" },
  { value: "group",  label: "Group"  },
  { value: "family", label: "Family" },
] as const;
type TravellerFilter = (typeof TRAVELLER_OPTIONS)[number]["value"];

const BUDGET_OPTIONS = [
  { value: "all",     label: "All",         range: undefined },
  { value: "under60", label: "Under ₹60k",  range: "budget"  },
  { value: "60to85",  label: "₹60k–₹85k",   range: "mid"     },
  { value: "over85",  label: "₹85k+",       range: "premium" },
] as const;
type BudgetFilter = (typeof BUDGET_OPTIONS)[number]["value"];

const MONTHS_ORDERED = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  initialTrips: Trip[];
  initialTotal: number;
}

export default function TripsBrowser({ initialTrips, initialTotal }: Props) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [total, setTotal] = useState<number>(initialTotal);
  const [loading, setLoading] = useState(false);

  const [bestFor, setBestFor] = useState<TravellerFilter>("all");
  const [budget, setBudget] = useState<BudgetFilter>("all");
  const [month, setMonth] = useState<string>("all");

  const [modalTrip, setModalTrip] = useState<Trip | null>(null);

  // Month pills derived from the initial (unfiltered) set so the bar
  // doesn't shrink as the user narrows results.
  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    initialTrips.forEach((t) => t.month?.forEach((m) => set.add(m)));
    const list = Array.from(set).sort(
      (a, b) => MONTHS_ORDERED.indexOf(a) - MONTHS_ORDERED.indexOf(b)
    );
    return [
      { value: "all", label: "All" },
      ...list.map((m) => ({ value: m, label: m })),
    ];
  }, [initialTrips]);

  const isClean = bestFor === "all" && budget === "all" && month === "all";

  useEffect(() => {
    if (isClean) {
      setTrips(initialTrips);
      setTotal(initialTotal);
      return;
    }
    const filters: TripFilters = {};
    if (bestFor !== "all") filters.bestFor = bestFor;
    const budgetOpt = BUDGET_OPTIONS.find((o) => o.value === budget);
    if (budgetOpt?.range) filters.budgetRange = budgetOpt.range;
    if (month !== "all") filters.month = month;

    let cancelled = false;
    setLoading(true);
    fetchTrips({ filters })
      .then((res) => {
        if (cancelled) return;
        setTrips(res.trips);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[trips] filter fetch failed", err);
        setTrips([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bestFor, budget, month, isClean, initialTrips, initialTotal]);

  const clearFilters = () => {
    setBestFor("all");
    setBudget("all");
    setMonth("all");
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16">
      {/* Page header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <p
          className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
          style={{ color: BRAND_GOLD }}
        >
          All Trips
        </p>
        <h1 className="font-script font-bold text-white text-4xl sm:text-6xl leading-none mb-4">
          Find Your{" "}
          <span className="italic" style={{ color: BRAND_GOLD }}>
            Next Adventure
          </span>
        </h1>
        <p className="text-white/40 text-sm sm:text-base">
          {loading
            ? "Searching…"
            : `${total} ${total === 1 ? "trip" : "trips"} available`}
        </p>
      </section>

      {/* Filter bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex flex-col gap-4">
        <FilterRow
          label="Travelling As"
          options={TRAVELLER_OPTIONS as readonly { value: string; label: string }[]}
          value={bestFor}
          onChange={(v) => setBestFor(v as TravellerFilter)}
        />
        <FilterRow
          label="Budget"
          options={BUDGET_OPTIONS as readonly { value: string; label: string }[]}
          value={budget}
          onChange={(v) => setBudget(v as BudgetFilter)}
        />
        <FilterRow
          label="Month"
          options={monthOptions}
          value={month}
          onChange={setMonth}
        />
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <SkeletonGrid />
        ) : trips.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
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
    </div>
  );
}

/* ─────────────────────────── Filter row ─────────────────────────── */

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 shrink-0 sm:w-36">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: selected ? BRAND_GOLD : "rgba(255,255,255,0.04)",
                color: selected ? "#000" : "rgba(255,255,255,0.7)",
                border: selected
                  ? `1px solid ${BRAND_GOLD}`
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
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

/* ─────────────────────────── Empty / loading ─────────────────────────── */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24 gap-4">
      <div className="text-5xl">✈️</div>
      <h3 className="text-white font-bold text-xl">
        No trips found for this filter
      </h3>
      <p className="text-white/40 text-sm">Try a different combination</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 px-6 py-3 rounded-xl font-bold text-xs tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-110"
        style={{ background: BRAND_GOLD, color: "#000" }}
      >
        Clear filters
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="h-[240px] bg-white/[0.03] animate-pulse" />
          <div className="px-5 py-5 flex flex-col gap-3">
            <div className="h-3 w-24 bg-white/[0.04] rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-white/[0.04] rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-white/[0.03] rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-white/[0.03] rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-white/[0.03] rounded animate-pulse" />
            <div className="h-10 w-32 bg-white/[0.03] rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-10 flex-1 bg-white/[0.03] rounded-xl animate-pulse" />
              <div className="h-10 flex-1 bg-white/[0.03] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
