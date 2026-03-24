"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import TalkToUsModal from "@/components/home/TalkToUsModal";
import KenyaScrollJourney from "@/components/trips/KenyaScrollJourney";
import { TRIPS } from "@/data/trips";

const KENYA = TRIPS.find((t) => t.slug === "kenya-safari")!;
const ACCENT = "#f5a623";

const INCLUSIONS = [
  "Return airport transfers in Kenya",
  "4★ & 5★ luxury hotels, resorts & safari lodges",
  "Brand new 4×4 Land Cruiser safari vehicles",
  "All meals — daily buffet breakfast, lunch & dinner",
  "All national park entry fees",
  "Professional English-speaking driver–guides",
  "African Sundowner experience 🍹",
  "Wilderness picnic lunches in the savannah",
  "Kenya ETA tourist visa assistance",
  "Comprehensive travel & medical insurance",
  "Two Bengali Trip Managers from India",
];
const EXCLUSIONS = [
  "International flights (Kolkata / Mumbai to Nairobi)",
  "Optional Hot Air Balloon Safari",
  "Tips & gratuities (~USD $50 per person)",
  "Personal shopping & miscellaneous expenses",
  "Drinking water & beverages",
  "Alcoholic & non-alcoholic drinks",
  "Additional hotel charges (Wi-Fi, minibar, etc.)",
  "Washroom usage fees during road trips",
  "Anything not listed in Inclusions",
];
const DISCLAIMERS = [
  {
    title: "Safari Reality Check ⚠️",
    body: "A safari is a wildlife expedition into natural habitats — not a controlled wildlife show. Animal sightings can never be guaranteed. Wild animals move freely and their behavior is influenced by weather, migration, and natural instincts. Safari travel involves long game drives, rough terrain, early departures, and variable weather. Approach this with patience and a spirit of adventure.",
  },
  {
    title: "Itinerary Changes ⚠️",
    body: "Travel is subject to weather, wildlife movement, government regulations, aviation schedules, and local security advisories. In the event of force majeure events, certain parts of the itinerary may be modified or cancelled. Bidhan Bar Vlogs reserves the right to alter any part of the itinerary for safety or operational reasons. No refunds shall arise for missed activities resulting from such events.",
  },
  {
    title: "Group Discipline ⚠️",
    body: "National parks operate under fixed gate timings. Punctuality is absolutely essential. If a guest fails to report on time, the group may proceed without them. Guests who skip activities will not receive refunds or alternative arrangements. By booking, you accept the operational nature of safari travel and group discipline requirements.",
  },
];

const DESTINATIONS = ["Nairobi", "Amboseli", "Lake Naivasha", "Lake Nakuru", "Hell's Gate", "Masai Mara"];
const MARQUEE_ITEMS = [...DESTINATIONS, ...DESTINATIONS];

/* ── Seamless marquee ── */
function RouteMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const rafRef   = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      posRef.current -= 1.64;
      const half = track.scrollWidth / 2;
      if (posRef.current <= -half) posRef.current += half;
      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Pause only when the browser tab is hidden — simpler and reliable
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
      <div ref={trackRef} className="flex items-center whitespace-nowrap" style={{ willChange: "transform" }}>
        {MARQUEE_ITEMS.map((d, i) => (
          <span key={i} className="flex items-center">
            <span className="font-black tracking-tight uppercase leading-none"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: i % 2 === 0 ? "rgba(255,255,255,0.75)" : ACCENT, paddingInline: "clamp(1rem, 2.5vw, 2rem)" }}>
              {d}
            </span>
            <span className="font-black" style={{ fontSize: "clamp(0.5rem, 1vw, 0.75rem)", color: `${ACCENT}55` }}>◆</span>
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

export default function KenyaSafariPage() {
  const [modalOpen, setModalOpen]           = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#060606] text-white">

      {/* ── Ambient orbs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <motion.div className="absolute rounded-full"
          animate={{ x:[0,60,-20,40,0], y:[0,-60,40,-30,0] }}
          transition={{ duration:24, repeat:Infinity, ease:"easeInOut", repeatType:"mirror" }}
          style={{ width:600, height:600, top:"10%", left:"-8%", background:"#f5a623", opacity:0.07, filter:"blur(130px)" }} />
        <motion.div className="absolute rounded-full"
          animate={{ x:[0,-50,30,-20,0], y:[0,70,-40,50,0] }}
          transition={{ duration:30, repeat:Infinity, ease:"easeInOut", repeatType:"mirror" }}
          style={{ width:500, height:500, bottom:"15%", right:"-6%", background:"#00e676", opacity:0.05, filter:"blur(120px)" }} />
        <motion.div className="absolute rounded-full"
          animate={{ x:[0,40,-60,20,0], y:[0,-50,60,-30,0] }}
          transition={{ duration:20, repeat:Infinity, ease:"easeInOut", repeatType:"mirror" }}
          style={{ width:400, height:400, top:"50%", left:"40%", background:"#e07b00", opacity:0.05, filter:"blur(110px)" }} />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ── Hero ── */}
        <div className="relative h-[70vh] sm:h-screen overflow-hidden">
          <Image src="/images/trips/kenya/kenya-1.jpg" alt="Kenya Safari" fill sizes="100vw" className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/95" />
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)" }} />

          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 pb-10 sm:pb-16">
            <motion.p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: ACCENT }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.6 }}>
              🇰🇪 Kenya · Land of Safari Legends
            </motion.p>
            <motion.h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight mb-4"
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45, duration:0.7 }}>
              Kenya Safari
            </motion.h1>
            <motion.p className="text-white/70 text-sm sm:text-base max-w-lg mb-6"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6, duration:0.6 }}>
              An epic journey into Africa's untamed wilderness — golden savannahs, the Big Five, and sunsets that touch your soul.
            </motion.p>
            <motion.div className="flex flex-wrap gap-3"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75, duration:0.6 }}>
              {[
                { label:"Dates",    value:"05 – 13 Jun" },
                { label:"Duration", value:"8N · 9D"     },
                { label:"Booking",  value:"₹65,000"     },
                { label:"Final",    value:"USD 1,420"   },
              ].map(({ label, value }) => (
                <div key={label} className="px-4 py-2 rounded-xl text-sm"
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(12px)" }}>
                  <span className="text-white/45 text-[10px] uppercase tracking-wider block">{label}</span>
                  <span className="font-black text-white">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Route Marquee ── */}
        <div className="relative overflow-hidden border-y py-2" style={{ borderColor: `${ACCENT}22` }}>
          <RouteMarquee />
        </div>

        {/* ── Intro ── */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-6">
          <FadeUp>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base">
              Golden savannahs stretching endlessly into the horizon, majestic elephants beneath the shadow of Mount Kilimanjaro, flamingo-covered lakes glowing pink at sunrise, and the thunder of hooves across the legendary plains of Masai Mara.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-white/60 leading-relaxed text-sm sm:text-base mt-4">
              This is not just a journey —{" "}
              <span className="text-white font-semibold">this is Africa in its purest form.</span>{" "}
              Join Bidhan Bar Vlogs on an unforgettable safari expedition through Kenya's most iconic landscapes.
            </p>
          </FadeUp>
        </div>

        {/* ── Scroll Journey ── */}
        <KenyaScrollJourney />

        {/* ── Rest ── */}
        <div className="max-w-3xl mx-auto px-5 sm:px-6 pb-12 sm:pb-20">

          <FadeUp className="mb-14 pt-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">
              What's <span className="italic" style={{ color: ACCENT }}>Included</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl p-5" style={{ background:"rgba(0,230,118,0.05)", border:"1px solid rgba(0,230,118,0.12)" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#00c864] mb-4">✓ Inclusions</p>
                <ul className="space-y-2.5">
                  {INCLUSIONS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="text-[#00c864] mt-0.5 flex-shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-5" style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.10)" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase text-red-400 mb-4">✗ Exclusions</p>
                <ul className="space-y-2.5">
                  {EXCLUSIONS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/50">
                      <span className="text-red-400/70 mt-0.5 flex-shrink-0">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>

          <FadeUp className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">
              Pricing & <span className="italic" style={{ color: ACCENT }}>Booking</span>
            </h2>
            <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ background:`rgba(245,166,35,0.06)`, border:`1px solid ${ACCENT}30` }}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Booking Amount</p>
                  <p className="text-3xl font-black" style={{ color: ACCENT }}>₹65,000</p>
                  <p className="text-white/35 text-xs mt-1">Per person advance</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">Final Payment</p>
                  <p className="text-3xl font-black text-white">USD 1,420</p>
                  <p className="text-white/35 text-xs mt-1">Due 30 days before departure</p>
                </div>
              </div>
              <div className="border-t pt-4 text-xs text-white/35 space-y-1.5" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                <p>📞 +91 70037 99172 &nbsp;|&nbsp; +84 38 215 4314 (WhatsApp)</p>
                <p>📩 Send passport copy (first & last page) + booking amount to confirm</p>
                <p>🎟️ Kenya ETA visa issued 21 days before departure</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:brightness-110"
                style={{ background: ACCENT, color:"#000", boxShadow:`0 4px 28px ${ACCENT}40` }}>
                🎟️ Book Your Spot
              </button>
              <button onClick={() => setModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:brightness-110"
                style={{ background:"#25d366", color:"#fff", boxShadow:"0 4px 20px rgba(37,211,102,0.28)" }}>
                💬 Talk to Us
              </button>
            </div>
          </FadeUp>

          <FadeUp className="mb-20">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white/20 mb-4">Important Notes</h3>
            <div className="space-y-2">
              {DISCLAIMERS.map((d, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.05)" }}>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpenDisclaimer(openDisclaimer === i ? null : i)}>
                    <span className="text-xs font-semibold text-white/35">{d.title}</span>
                    <span className="text-white/20 text-sm">{openDisclaimer === i ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openDisclaimer === i && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                        exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} className="overflow-hidden">
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

          <Link href="/" className="text-xs text-white/25 hover:text-white/55 transition-colors">
            ← Back to home
          </Link>
        </div>

        {/* ── Sticky mobile CTA ── */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 p-4"
          style={{ background:"linear-gradient(to top, rgba(6,6,6,0.98) 60%, transparent)" }}>
          <button onClick={() => setModalOpen(true)}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
            style={{ background: ACCENT, color:"#000" }}>
            🎟️ Book Spot
          </button>
          <button onClick={() => setModalOpen(true)}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider"
            style={{ background:"#25d366", color:"#fff" }}>
            💬 Talk to Us
          </button>
        </div>
      </div>

      {modalOpen && <TalkToUsModal trip={KENYA} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
