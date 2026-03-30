"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarfieldCanvas from "@/components/ui/StarfieldCanvas";
import PlanTripModal from "./PlanTripModal";

/* ── Slot-machine destinations ── */
const SLOTS = [
  { label: "Egypt",      color: "#e8b84b" },
  { label: "Kenya",      color: "#00e676" },
  { label: "Bali",       color: "#00d4aa" },
  { label: "Thailand",   color: "#f72585" },
  { label: "Everywhere", color: "#00e676" },
];

const SLOT_INTERVAL = 2400; // ms each word shows

function SlotDestination() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLOTS.length), SLOT_INTERVAL);
    return () => clearInterval(t);
  }, []);

  const current = SLOTS[idx];

  return (
    /* Fixed height clip — only one word visible at a time */
    <div
      className="overflow-hidden"
      style={{ height: "1.15em", display: "inline-block", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={current.label}
          className="font-black tracking-tight block"
          style={{ color: current.color }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%",   opacity: 1 }}
          exit={{   y: "-110%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
        >
          {current.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function NoPlansCTAv2() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
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
          className="relative text-center mb-6 sm:mb-14"
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

        {/* ── Card ── */}
        <motion.div
          className="relative w-full max-w-[360px] sm:max-w-[720px]"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1], delay: 0.12 }}
        >

          {/* ════ MOBILE — vertical ticket ════ */}
          <div className="sm:hidden">
            <div
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                isolation: "isolate",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              {/* Top stub */}
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-script font-bold text-white text-base tracking-wide leading-none">ghoomo world</p>
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/35 mt-0.5">Custom Escape</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/35">Boarding Pass</p>
                    <p className="text-[11px] font-bold text-white/55 font-mono mt-0.5">#GW-000001</p>
                  </div>
                </div>

                {/* Route — vertical with slot animation */}
                <div className="flex flex-col items-start gap-3">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-white/35 mb-0.5">From</p>
                    <p className="text-2xl font-black text-white tracking-tight leading-none">Your Doorstep</p>
                  </div>

                  <div className="flex flex-col items-center gap-1 pl-2" style={{ color: "#00e676" }}>
                    <div className="w-px h-5" style={{ background: "linear-gradient(to bottom, rgba(0,230,118,0.6), rgba(0,230,118,0.2))" }} />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-white/35 mb-0.5">To</p>
                    <div className="text-3xl leading-none">
                      <SlotDestination />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-end gap-5 pt-3 border-t border-white/8">
                  <div>
                    <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Pass Status</p>
                    <p className="text-[10px] font-bold text-white/70">FULL VIBE</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Class</p>
                    <p className="text-[10px] font-bold text-white/70">CURATED</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-[8px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Seat</p>
                    <p className="text-[10px] font-bold text-white font-mono">01A</p>
                  </div>
                </div>
              </div>

              {/* Horizontal dashed tear line + punch holes */}
              <div className="relative h-px" style={{ borderTop: "1.5px dashed rgba(255,255,255,0.14)" }}>
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full pointer-events-none"
                  style={{ transform: "translate(-50%, -50%)", background: "black", mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"] }} />
                <div className="absolute right-0 top-0 w-6 h-6 rounded-full pointer-events-none"
                  style={{ transform: "translate(50%, -50%)", background: "black", mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"] }} />
              </div>

              {/* Bottom stub — CTA */}
              <div className="p-6 flex flex-col items-center gap-4"
                style={{ background: "linear-gradient(180deg, rgba(0,230,118,0.07) 0%, rgba(0,212,170,0.04) 100%)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.25)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white leading-snug">Not sure where to go?</p>
                  <p className="text-xs text-white/45 mt-1.5 leading-relaxed">Tell us your vibe. We'll craft the rest.</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full text-sm font-bold text-[#0a0a0a] py-3 rounded-xl transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ background: "#00e676" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
                  </svg>
                  Plan My Trip
                </button>
              </div>
            </div>
          </div>

          {/* ════ DESKTOP — horizontal two-panel ════ */}
          <div className="hidden sm:block">
            <div
              className="relative flex rounded-2xl overflow-hidden"
              style={{
                isolation: "isolate",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              {/* Left panel */}
              <div className="flex-1 min-w-0 p-10 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-script font-bold text-white text-lg tracking-wide leading-none">ghoomo world</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mt-0.5">Custom Escape</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35">Boarding Pass</p>
                    <p className="text-sm font-bold text-white/55 font-mono">#GW-000001</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/35 mb-1">From</p>
                    <p className="text-3xl font-black text-white tracking-tight leading-none">Your Doorstep</p>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: "#00e676" }}>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(0,230,118,0.6), rgba(0,230,118,0.1))" }} />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(0,230,118,0.6), rgba(0,230,118,0.1))" }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/35 mb-1">To</p>
                    <div className="text-4xl leading-none">
                      <SlotDestination />
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-6 pt-3 border-t border-white/8">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Pass Status</p>
                    <p className="text-xs font-bold text-white/70">FULL VIBE</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Class</p>
                    <p className="text-xs font-bold text-white/70">CURATED</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/30 mb-0.5">Seat</p>
                    <p className="text-xs font-bold text-white font-mono">01A</p>
                  </div>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="relative flex-shrink-0 w-px self-stretch" style={{ borderLeft: "1.5px dashed rgba(255,255,255,0.14)" }} />

              {/* Right panel */}
              <div
                className="w-[220px] flex-shrink-0 p-10 flex flex-col items-center justify-center gap-5 rounded-r-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(0,212,170,0.05) 100%)",
                  borderLeft: "1px solid rgba(0,230,118,0.1)",
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.25)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white leading-snug">Not sure<br />where to go?</p>
                  <p className="text-xs text-white/45 mt-2 leading-relaxed">Tell us your vibe.<br />We'll craft the rest.</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full text-xs font-bold text-[#0a0a0a] py-3 rounded-xl transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] active:scale-95"
                  style={{ background: "#00e676" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
                  </svg>
                  Plan My Trip
                </button>
              </div>

              {/* Desktop punch holes */}
              <div className="absolute pointer-events-none" style={{ top: 0, right: "220px", width: 28, height: 28, borderRadius: "50%", transform: "translate(50%, -50%)", background: "black", mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"] }} />
              <div className="absolute pointer-events-none" style={{ bottom: 0, right: "220px", width: 28, height: 28, borderRadius: "50%", transform: "translate(50%, 50%)", background: "black", mixBlendMode: "destination-out" as unknown as React.CSSProperties["mixBlendMode"] }} />
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(0,230,118,0.15) 0%, transparent 70%)", filter: "blur(12px)" }} />
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          className="relative mt-6 sm:mt-10 text-[10px] sm:text-xs text-white/25 font-medium tracking-wide text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Group trips · Honeymoons · Family holidays · Solo adventures
        </motion.p>
      </section>

      {/* ── Modal ── */}
      {modalOpen && <PlanTripModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
