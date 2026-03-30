"use client";

import React from "react";
import { motion } from "framer-motion";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";

const WHATSAPP_URL = "https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20planning%20a%20custom%20trip.";

/*
  Punch-hole approach:
  - Card has `isolation: isolate` + `overflow: hidden`
  - Two circles inside the card use `mix-blend-mode: destination-out`
  - Black fill + destination-out = transparent hole punched through the card
  - overflow:hidden clips each circle to a semicircle at top/bottom edge
  - The section background (starfield) shows through naturally

  Circle center must be at the divider line (220px from right on desktop):
    right: 220px; transform: translate(50%, ±50%);
*/

export default function NoPlansCTA() {
  return (
    <section className="relative h-[100dvh] sm:min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden snap-start px-4">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,230,118,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 45% 40% at 20% 80%, rgba(124,58,237,0.12) 0%, transparent 65%),
          radial-gradient(ellipse 40% 45% at 80% 20%, rgba(232,184,75,0.08) 0%, transparent 65%),
          #0a0a0a
        `,
      }}>
        <StarfieldCanvas opacity={0.35} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "128px",
        }} />
      </div>

      {/* ── Section heading ── */}
      <motion.div
        className="relative text-center mb-8 sm:mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-[#00e676] mb-2 sm:mb-3">
          Custom Trips
        </p>
        <h2 className="text-4xl sm:text-6xl font-script font-bold text-white leading-none">
          No Plans{" "}
          <span className="italic text-[#00e676]">Yet?</span>
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/45 font-medium">
          Every great journey starts with a single conversation.
        </p>
      </motion.div>

      {/* ── Boarding pass card ── */}
      <motion.div
        className="relative w-full max-w-[720px]"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1], delay: 0.12 }}
      >
        {/* Card — isolation:isolate creates a compositing group for destination-out blend */}
        <div
          className="relative flex rounded-2xl overflow-hidden"
          style={{
            isolation: "isolate",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >

          {/* ── Left panel ── */}
          <div className="flex-1 min-w-0 p-5 sm:p-10 flex flex-col gap-4 sm:gap-6">

            {/* Brand — always visible on left */}
            <div>
              <p className="font-script font-bold text-white text-sm sm:text-lg tracking-wide leading-none">
                ghoomo world
              </p>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mt-0.5">
                Custom Escape
              </p>
            </div>

            {/* Boarding pass number — desktop only (shown in right panel on mobile) */}
            <div className="hidden sm:flex items-start justify-between -mt-2">
              <div /> {/* spacer */}
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35">Boarding Pass</p>
                <p className="text-sm font-bold text-white/55 font-mono">#GW-000001</p>
              </div>
            </div>

            {/* Route */}
            <div className="flex flex-col gap-2.5 sm:gap-4">
              <div>
                <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-white/35 mb-0.5 sm:mb-1">
                  From
                </p>
                <p className="text-lg sm:text-3xl font-black text-white tracking-tight leading-none">
                  Your Doorstep
                </p>
              </div>

              <div className="flex items-center gap-3" style={{ color: "#00e676" }}>
                <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(0,230,118,0.6), rgba(0,230,118,0.1))" }} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(0,230,118,0.6), rgba(0,230,118,0.1))" }} />
              </div>

              <div>
                <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase text-white/35 mb-0.5 sm:mb-1">
                  To
                </p>
                <p className="text-lg sm:text-4xl font-black tracking-tight leading-none" style={{ color: "#00e676" }}>
                  Everywhere
                </p>
              </div>
            </div>

            {/* Footer — desktop only */}
            <div className="hidden sm:flex items-end gap-6 pt-3 border-t border-white/8">
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Pass Status</p>
                <p className="text-xs font-bold text-white/70 tracking-wide">FULL VIBE</p>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Class</p>
                <p className="text-xs font-bold text-white/70 tracking-wide">CURATED</p>
              </div>
              <div className="ml-auto">
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Seat</p>
                <p className="text-xs font-bold text-white font-mono">01A</p>
              </div>
            </div>
          </div>

          {/* ── Perforated divider (desktop only) ── */}
          <div
            className="hidden sm:block relative flex-shrink-0 w-px self-stretch"
            style={{ borderLeft: "1.5px dashed rgba(255,255,255,0.14)" }}
          />

          {/* ── Right panel ── */}
          <div
            className="w-[130px] sm:w-[220px] flex-shrink-0 p-4 sm:p-10 flex flex-col items-center justify-center gap-3 sm:gap-5 rounded-r-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(0,212,170,0.05) 100%)",
              borderLeft: "1px solid rgba(0,230,118,0.1)",
            }}
          >
            {/* Boarding pass number — mobile only */}
            <div className="sm:hidden text-center w-full border-b border-white/8 pb-3 mb-1">
              <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-white/35">
                Boarding Pass
              </p>
              <p className="text-[10px] font-bold text-white/55 font-mono mt-0.5">#GW-000001</p>
            </div>

            {/* Icon */}
            <div
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.25)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-[11px] sm:text-sm font-bold text-white leading-snug">
                Not sure<br />where to go?
              </p>
              <p className="text-[10px] sm:text-xs text-white/45 mt-1.5 sm:mt-2 leading-relaxed hidden sm:block">
                Tell us your vibe.<br />We'll craft the rest.
              </p>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 sm:gap-2 w-full text-[10px] sm:text-xs font-bold text-[#0a0a0a] py-2 sm:py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] active:scale-95"
              style={{ background: "#00e676" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
              </svg>
              Get a Quote
            </a>
          </div>

          {/*
            Punch holes — inside the card, using mix-blend-mode: destination-out.
            isolation:isolate on the card creates a compositing group.
            Black fill + destination-out punches a transparent hole through everything
            in that group. overflow:hidden clips each to a semicircle at the card edge.
            Centered on the divider: right:220px + translate(50%) centers the circle.
            Desktop only (hidden sm:block).
          */}
          <div
            className="absolute pointer-events-none hidden sm:block"
            style={{
              top: 0,
              right: "220px",
              width: 28,
              height: 28,
              borderRadius: "50%",
              transform: "translate(50%, -50%)",
              background: "black",
              mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"],
            }}
          />
          <div
            className="absolute pointer-events-none hidden sm:block"
            style={{
              bottom: 0,
              right: "220px",
              width: 28,
              height: 28,
              borderRadius: "50%",
              transform: "translate(50%, 50%)",
              background: "black",
              mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"],
            }}
          />
        </div>

        {/* Glow under card */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,230,118,0.15) 0%, transparent 70%)", filter: "blur(12px)" }}
        />
      </motion.div>

      {/* ── Bottom hint ── */}
      <motion.p
        className="relative mt-8 sm:mt-10 text-[10px] sm:text-xs text-white/25 font-medium tracking-wide text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Group trips · Honeymoons · Family holidays · Solo adventures
      </motion.p>
    </section>
  );
}
