"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Trip } from "@/types/trip";

const BRAND_GOLD = "#e8b84b";
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 86400000;

interface ParsedTrip extends Trip {
  startD: Date;
  endD: Date;
}

function stripTime(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function dayDiff(a: Date, b: Date): number {
  return Math.round((stripTime(b) - stripTime(a)) / DAY_MS);
}
function sameDate(a: Date, b: Date): boolean {
  return dayDiff(a, b) === 0;
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function fmtDate(d: Date): string {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}
function fmtRange(t: ParsedTrip): string {
  if (t.startD.getMonth() === t.endD.getMonth() && t.startD.getFullYear() === t.endD.getFullYear()) {
    return `${t.startD.getDate()} – ${fmtDate(t.endD)}`;
  }
  const yearSuffix = t.startD.getFullYear() !== t.endD.getFullYear() ? ` ${t.endD.getFullYear()}` : "";
  return `${fmtDate(t.startD)} – ${fmtDate(t.endD)}${yearSuffix}`;
}

function buildWeeks(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const gridStart = addDays(first, -first.getDay());
  const lastOfMonth = new Date(year, month + 1, 0);
  const totalDays = dayDiff(gridStart, lastOfMonth) + 1;
  const weekCount = Math.ceil(totalDays / 7);
  const weeks: Date[][] = [];
  let cur = gridStart;
  for (let w = 0; w < weekCount; w++) {
    weeks.push(Array.from({ length: 7 }, (_, d) => addDays(cur, d)));
    cur = addDays(cur, 7);
  }
  return weeks;
}

function assignLanes(trips: ParsedTrip[]): { laneOf: Map<string, number>; laneCount: number } {
  const sorted = [...trips].sort((a, b) => a.startD.getTime() - b.startD.getTime());
  const laneEnds: Date[] = [];
  const laneOf = new Map<string, number>();
  sorted.forEach((t) => {
    let placed = false;
    for (let i = 0; i < laneEnds.length; i++) {
      if (t.startD > laneEnds[i]) {
        laneOf.set(t.id, i);
        laneEnds[i] = t.endD;
        placed = true;
        break;
      }
    }
    if (!placed) {
      laneOf.set(t.id, laneEnds.length);
      laneEnds.push(t.endD);
    }
  });
  return { laneOf, laneCount: laneEnds.length || 1 };
}

export default function TripsCalendar({ trips }: { trips: Trip[] }) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));

  const parsed: ParsedTrip[] = useMemo(
    () => trips.map((t) => ({ ...t, startD: new Date(t.startDate), endD: new Date(t.endDate) })),
    [trips]
  );

  const weeks = useMemo(() => buildWeeks(cursor.year, cursor.month), [cursor]);
  const gridStart = weeks[0][0];
  const gridEnd = weeks[weeks.length - 1][6];

  const visible = useMemo(
    () => parsed.filter((t) => t.startD <= gridEnd && t.endD >= gridStart),
    [parsed, gridStart, gridEnd]
  );
  const lanes = useMemo(() => assignLanes(visible), [visible]);

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  const goToday = () => setCursor({ year: today.getFullYear(), month: today.getMonth() });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Nav */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="font-script font-bold text-white text-lg">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Today
          </button>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous month"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-2 sm:px-3 pt-2 pb-1">
        <div className="grid grid-cols-7 px-1 pb-2">
          {DOW.map((d) => (
            <span key={d} className="text-[9px] sm:text-[10px] font-bold tracking-wide uppercase text-white/30 text-center">
              {d}
            </span>
          ))}
        </div>

        {weeks.map((week, wi) => {
          const weekStart = week[0];
          const weekEnd = week[6];
          const weekTrips = visible.filter((t) => !(t.endD < weekStart || t.startD > weekEnd));

          return (
            <div
              key={wi}
              className="trip-week grid grid-cols-7"
              style={{ "--lane-count": lanes.laneCount, borderTop: wi > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" } as CSSProperties}
            >
              {week.map((day, i) => {
                const isPad = day.getMonth() !== cursor.month;
                const isToday = sameDate(day, today);
                return (
                  <div key={i} className="text-[10px] sm:text-[11.5px] py-1 px-1" style={{ gridRow: 1, gridColumn: i + 1 }}>
                    {isToday ? (
                      <span
                        className="inline-flex items-center justify-center rounded-full font-bold"
                        style={{ width: 18, height: 18, background: BRAND_GOLD, color: "#16130a" }}
                      >
                        {day.getDate()}
                      </span>
                    ) : (
                      <span className={isPad ? "text-white/15" : "text-white/50"}>{day.getDate()}</span>
                    )}
                  </div>
                );
              })}

              {weekTrips.map((t) => {
                const startCol = t.startD > weekStart ? dayDiff(weekStart, t.startD) : 0;
                const endCol = t.endD < weekEnd ? dayDiff(weekStart, t.endD) : 6;
                const contL = t.startD < weekStart;
                const contR = t.endD > weekEnd;

                return (
                  <Link
                    key={t.id}
                    href={`/trips/${t.slug}`}
                    title={`${t.name} (${fmtRange(t)})`}
                    className="flex items-center overflow-hidden text-[10px] sm:text-[10.5px] font-bold h-[10px] sm:h-[22px] mx-px sm:mx-[3px] my-px px-1 sm:px-1.5 gap-1 hover:brightness-110 transition-[filter]"
                    style={{
                      gridRow: 2 + (lanes.laneOf.get(t.id) ?? 0),
                      gridColumn: `${startCol + 1} / span ${endCol - startCol + 1}`,
                      background: t.accentColor,
                      color: "#0c0b08",
                      borderTopLeftRadius: contL ? 0 : 6,
                      borderBottomLeftRadius: contL ? 0 : 6,
                      borderTopRightRadius: contR ? 0 : 6,
                      borderBottomRightRadius: contR ? 0 : 6,
                    }}
                  >
                    {contL && <span className="opacity-60 font-black hidden sm:inline">‹</span>}
                    <span className="hidden sm:inline truncate">
                      {!contL && `${t.flag} `}
                      {(!contL || startCol === 0) && t.name}
                    </span>
                    {contR && <span className="opacity-60 font-black hidden sm:inline">›</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Mobile legend — bars drop their text below 640px, so trips are
          identified by this color-coded list instead. */}
      {visible.length > 0 && (
        <div className="flex sm:hidden flex-wrap gap-x-3.5 gap-y-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {visible.map((t) => (
            <Link key={t.id} href={`/trips/${t.slug}`} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: t.accentColor }} />
              {t.flag} {t.name}
            </Link>
          ))}
        </div>
      )}

      {visible.length === 0 && (
        <div className="text-center py-6 text-xs text-white/30" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          No trips this month
        </div>
      )}
    </div>
  );
}
