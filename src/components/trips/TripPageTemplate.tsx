"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X as XIcon, CheckCircle, XCircle,
  Ticket, Warning, Plus, Minus, ArrowLeft, WhatsappLogo,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import TalkToUsModal from "@/components/home/TalkToUsModal";
import TripScrollJourney from "@/components/trips/TripScrollJourney";
import { TripPageConfig } from "@/types/trip";

/* ── Marquee ── */
function RouteMarquee({ destinations, accent }: { destinations: string[]; accent: string }) {
  const items    = [...destinations, ...destinations];
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const rafRef   = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);
    if (mobile) return;

    const track = trackRef.current;
    if (!track) return;
    const tick = () => {
      posRef.current -= 1.64;
      const half = track.scrollWidth / 2;
      if (posRef.current <= -half) posRef.current += half;
      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #060606, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #060606, transparent)" }} />
      <div ref={trackRef} className="flex items-center whitespace-nowrap"
        style={isMobile ? { animation: "marquee 18s linear infinite" } : { willChange: "transform" }}>
        {items.map((d, i) => (
          <span key={i} className="flex items-center">
            <span className="font-black tracking-tight uppercase leading-none"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: i % 2 === 0 ? "rgba(255,255,255,0.75)" : accent, paddingInline: "clamp(1rem, 2.5vw, 2rem)" }}>
              {d}
            </span>
            <span className="font-black" style={{ fontSize: "clamp(0.5rem, 1vw, 0.75rem)", color: `${accent}55` }}>◆</span>
          </span>
        ))}
      </div>
    </>
  );
}

/* ── Fade-up ── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: "easeOut", delay }}>
      {children}
    </motion.div>
  );
}

/* ── Template ── */
export default function TripPageTemplate({
  trip, accent, heroImage, heroLabel, heroTitle, heroTagline, heroStats,
  introLines, marqueeDestinations, days,
  inclusions, exclusions, bookingAmount, finalPayment, bookingInfoLines,
  disclaimers, slots,
}: TripPageConfig) {
  const [modalOpen, setModalOpen]           = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState<number | null>(null);

  // Derive rgba string from hex for tinted boxes
  const hex  = accent.replace("#", "");
  const r    = parseInt(hex.slice(0, 2), 16);
  const g    = parseInt(hex.slice(2, 4), 16);
  const b    = parseInt(hex.slice(4, 6), 16);
  const tint = `rgba(${r},${g},${b},0.06)`;

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="relative z-10">
        <Navbar />

        {/* ── Hero ── */}
        <div className="relative h-[70vh] sm:h-screen overflow-hidden">
          <Image src={heroImage} alt={heroTitle} fill sizes="100vw" className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/95" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)" }} />

          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 pb-10 sm:pb-16">
            <motion.p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: accent }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              {heroLabel}
            </motion.p>
            <motion.h1 className="text-5xl sm:text-7xl font-script font-bold leading-none mb-4"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>
              {heroTitle}
            </motion.h1>
            <motion.p className="text-white/70 text-sm sm:text-base max-w-lg mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              {heroTagline}
            </motion.p>
            <motion.div className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}>
              {heroStats.map(({ label, value }) => (
                <div key={label} className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
                  <span className="text-white/45 text-[10px] uppercase tracking-wider block">{label}</span>
                  <span className="font-black text-white">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Route Marquee ── */}
        <div className="relative overflow-hidden border-y py-2" style={{ borderColor: `${accent}22` }}>
          <RouteMarquee destinations={marqueeDestinations} accent={accent} />
        </div>

        {/* ── Intro ── */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-6">
          <FadeUp>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base">{introLines[0]}</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base mt-4"
              dangerouslySetInnerHTML={{ __html: introLines[1] }} />
          </FadeUp>
        </div>

        {/* ── Slot: after intro ── */}
        {slots?.afterIntro}

        {/* ── Scroll Journey ── */}
        <TripScrollJourney days={days} accent={accent} />

        {/* ── Slot: after journey ── */}
        {slots?.afterJourney}

        {/* ── Rest ── */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-12 sm:pb-20">

          <FadeUp className="mb-14 pt-10">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 mb-2">Trip Details</p>
            <h2 className="text-2xl sm:text-3xl font-script font-bold mb-8">
              What&apos;s <span className="italic" style={{ color: accent }}>Included</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Inclusions */}
              <div className="rounded-2xl overflow-hidden" style={{
                background: "linear-gradient(145deg, rgba(0,230,118,0.08) 0%, rgba(6,6,6,0.6) 55%)",
                border: "1px solid rgba(0,230,118,0.18)",
                boxShadow: "0 0 40px rgba(0,230,118,0.04), inset 0 1px 0 rgba(0,230,118,0.1)",
              }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(0,230,118,0.10)", background: "rgba(0,230,118,0.06)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,230,118,0.14)", border: "1px solid rgba(0,230,118,0.28)" }}>
                    <Check size={14} weight="bold" color="#00e676" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: "#00e676" }}>Inclusions</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{inclusions.length} items covered</p>
                  </div>
                </div>
                <ul className="px-5 py-2">
                  {inclusions.map((item, i) => (
                    <li key={item} className="flex items-start gap-3 py-2.5"
                      style={{ borderBottom: i < inclusions.length - 1 ? "1px solid rgba(0,230,118,0.07)" : "none" }}>
                      <CheckCircle size={17} weight="fill" color="#00e676" className="flex-shrink-0 mt-0.5 opacity-80" />
                      <span className="text-sm text-white/70 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="rounded-2xl overflow-hidden" style={{
                background: "linear-gradient(145deg, rgba(239,68,68,0.07) 0%, rgba(6,6,6,0.6) 55%)",
                border: "1px solid rgba(239,68,68,0.15)",
                boxShadow: "0 0 40px rgba(239,68,68,0.03), inset 0 1px 0 rgba(239,68,68,0.08)",
              }}>
                <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(239,68,68,0.08)", background: "rgba(239,68,68,0.05)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <XIcon size={14} weight="bold" color="#ef4444" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.2em] uppercase text-red-400">Exclusions</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{exclusions.length} items not covered</p>
                  </div>
                </div>
                <ul className="px-5 py-2">
                  {exclusions.map((item, i) => (
                    <li key={item} className="flex items-start gap-3 py-2.5"
                      style={{ borderBottom: i < exclusions.length - 1 ? "1px solid rgba(239,68,68,0.07)" : "none" }}>
                      <XCircle size={17} weight="fill" color="#ef4444" className="flex-shrink-0 mt-0.5 opacity-80" />
                      <span className="text-sm text-white/55 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>

          {/* ── Slot: after inclusions ── */}
          {slots?.afterInclusions}

          <FadeUp className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-script font-bold mb-6">
              Pricing & <span className="italic" style={{ color: accent }}>Booking</span>
            </h2>
            <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background: tint, border: `1px solid ${accent}30` }}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Booking Amount</p>
                  <p className="text-3xl font-black" style={{ color: accent }}>{bookingAmount}</p>
                  <p className="text-white/35 text-xs mt-1">Per person advance</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Final Payment</p>
                  <p className="text-3xl font-black text-white">{finalPayment}</p>
                  <p className="text-white/35 text-xs mt-1">Due 30 days before departure</p>
                </div>
              </div>
              {bookingInfoLines && bookingInfoLines.length > 0 && (
                <div className="border-t pt-4 text-xs text-white/35 space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {bookingInfoLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:brightness-110"
                style={{ background: accent, color: "#000", boxShadow: `0 4px 28px ${accent}40` }}>
                <Ticket size={16} weight="bold" /> Book Your Spot
              </button>
              <button onClick={() => setModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:brightness-110"
                style={{ background: "#25d366", color: "#fff", boxShadow: "0 4px 20px rgba(37,211,102,0.28)" }}>
                <WhatsappLogo size={16} weight="fill" /> Talk to Us
              </button>
            </div>
          </FadeUp>

          <FadeUp className="mb-20">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/20 mb-4">Important Notes</h3>
            <div className="space-y-2">
              {disclaimers.map((d, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpenDisclaimer(openDisclaimer === i ? null : i)}>
                    <span className="flex items-center gap-2 text-xs font-semibold text-white/35">
                      <Warning size={13} weight="fill" className="text-amber-500/60 flex-shrink-0" />
                      {d.title}
                    </span>
                    {openDisclaimer === i
                      ? <Minus size={13} weight="bold" className="text-white/20 flex-shrink-0" />
                      : <Plus  size={13} weight="bold" className="text-white/20 flex-shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {openDisclaimer === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-xs text-white/28 leading-relaxed border-t border-white/[0.04]">
                          {d.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </FadeUp>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-white/25 hover:text-white/55 transition-colors">
            <ArrowLeft size={12} weight="bold" /> Back to home
          </Link>
        </div>

        {/* ── Sticky mobile CTA ── */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 p-4"
          style={{ background: "linear-gradient(to top, rgba(6,6,6,0.98) 60%, transparent)" }}>
          <button onClick={() => setModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
            style={{ background: accent, color: "#000" }}>
            <Ticket size={15} weight="bold" /> Book Spot
          </button>
          <button onClick={() => setModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
            style={{ background: "#25d366", color: "#fff" }}>
            <WhatsappLogo size={15} weight="fill" /> Talk to Us
          </button>
        </div>
      </div>

      {modalOpen && <TalkToUsModal trip={trip} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
