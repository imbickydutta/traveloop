"use client";

import { motion } from "framer-motion";
import { useEffect, useId, useState } from "react";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => { setMobile(window.matchMedia("(max-width: 768px)").matches); }, []);
  return mobile;
}

/* ── Timing — Navbar reads TRAVEL_DURATION to sync its fade-in ── */
export const TRAVEL_DURATION = 0.75;

const FONT_PX    = 21;
const NAV_HEIGHT = 64;
const APPROX_W   = 150;   // "ghoomo.world" approx width at 21px DM Sans Black
const APPROX_H   = 26;
const HERO_TOP   = 96;    // px from viewport top (64px navbar + 32px gap)

/**
 * Returns the LEFT offset of the navbar logo in pixels, matching the
 * CSS layout: max-w-7xl (1280px) centered + px-4 / sm:px-6 padding.
 */
function getNavLogoLeft(vw: number): number {
  const maxW = 1280;                        // max-w-7xl
  const pad  = vw >= 640 ? 24 : 16;        // sm:px-6 : px-4
  return vw > maxW ? Math.floor((vw - maxW) / 2) + pad : pad;
}

/* ── Traveling beam ∞
   One closed figure-eight stroke: centre → right loop → centre → left loop.
─────────────────────────────────────────────────────────── */
const INF_STROKE =
  "M12 12 C14 7,20.5 7,20.5 12 C20.5 17,14 17,12 12 C10 7,3.5 7,3.5 12 C3.5 17,10 17,12 12Z";

const PATH_LEN = 58;   // approximate total length in viewBox units
const BEAM_LEN = 8;    // length of the traveling bright dash

export function BlinkingOo({ subtle = false }: { subtle?: boolean }) {
  const GREEN = "#00e676";
  const isMobile = useIsMobile();

  return (
    <svg
      width="1.3em" height="0.72em" viewBox="2.5 6.5 19 11"
      fill="none" aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Dim base — full shape always visible */}
      <path
        d={INF_STROKE}
        stroke={GREEN} strokeWidth="1.8" strokeOpacity={subtle ? 0.25 : 0.2}
        strokeLinecap="round"
      />

      {/* Traveling beam */}
      <motion.path
        d={INF_STROKE}
        stroke={GREEN} strokeWidth="1.8"
        strokeLinecap="round"
        style={isMobile ? undefined : { filter: `drop-shadow(0 0 3px ${GREEN})` }}
        strokeDasharray={`${BEAM_LEN} ${PATH_LEN - BEAM_LEN}`}
        animate={{ strokeDashoffset: [0, -PATH_LEN] }}
        transition={{ duration: subtle ? 3 : 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

/* ── Rotating Globe — replaces the "o" in ".world" ──────────────────────── */
export function RotatingGlobe({ subtle = false }: { subtle?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    limb: `gl${uid}`,
    spec: `gs${uid}`,
    atm : `ga${uid}`,
  };

  return (
    <span
      aria-hidden="true"
      style={{
        display:       "inline-block",
        position:      "relative",
        width:         "0.95em",
        height:        "0.95em",
        verticalAlign: "middle",
        borderRadius:  "50%",
        overflow:      "hidden",
        flexShrink:    0,
      }}
    >
      {/* Rotating Earth GIF */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/rotating-earth.gif"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Shiny overlay — limb darkening + atmospheric rim + specular highlight */}
      <svg
        viewBox="0 0 24 24" fill="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          {/* Limb darkening — edges fade to black for 3-D roundness */}
          <radialGradient id={ids.limb} cx="50%" cy="50%" r="50%">
            <stop offset="60%"  stopColor="black" stopOpacity="0"    />
            <stop offset="100%" stopColor="black" stopOpacity="0.75" />
          </radialGradient>

          {/* Atmospheric rim — blue glow at the edge like from orbit */}
          <radialGradient id={ids.atm} cx="50%" cy="50%" r="50%">
            <stop offset="76%"  stopColor="transparent" />
            <stop offset="92%"  stopColor="#5ab0ff" stopOpacity={subtle ? 0.28 : 0.55} />
            <stop offset="100%" stopColor="#88c8ff" stopOpacity="0" />
          </radialGradient>

          {/* Specular highlight — sun glint top-left */}
          <radialGradient id={ids.spec} cx="33%" cy="27%" r="36%">
            <stop offset="0%"   stopColor="white" stopOpacity={subtle ? 0.22 : 0.48} />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="12" cy="12" r="12" fill={`url(#${ids.limb})`} />
        <circle cx="12" cy="12" r="12" fill={`url(#${ids.atm})`}  />
        <circle cx="12" cy="12" r="12" fill={`url(#${ids.spec})`} />
      </svg>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   BrandReveal

   • Returns null on SSR / before viewport is measured.
   • Uses initial={false} so on first client render the element
     SNAPS to the animate values (hero position) without
     Framer Motion trying to animate from the default 0/0/1.
   • When the user scrolls, `gone` flips to true and Framer
     Motion animates from the current (hero) position to
     the navbar position automatically.
───────────────────────────────────────────────────────── */
export default function BrandReveal({ hidden = false }: { hidden?: boolean }) {
  const [ready, setReady] = useState(false);
  const [vw, setVw]       = useState(0);
  const [gone, setGone]   = useState(false);

  /* ── measure viewport (client only) ── */
  useEffect(() => {
    setVw(window.innerWidth);
    setReady(true);

    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── toggle gone based on scroll position ──
     Uses capture so it fires even when a child element (e.g. <main>
     with snap scroll) is the actual scroll container, not window. ── */
  useEffect(() => {
    const onScroll = (e: Event) => {
      const t = e.target;
      const scrollY =
        t instanceof Element && t !== document.documentElement && t !== document.body
          ? t.scrollTop
          : window.scrollY;
      setGone(scrollY > 10);
    };
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  if (!ready) return null;

  /* ── geometry ── */
  const navLeft   = getNavLogoLeft(vw);
  const navTop    = (NAV_HEIGHT - APPROX_H) / 2;              // ≈ 19 px
  const heroScale = Math.min((vw * 0.48) / APPROX_W, 3.5);
  const heroLeft  = vw / 2 - (APPROX_W * heroScale) / 2;
  const startX    = heroLeft - navLeft;
  const startY    = HERO_TOP  - navTop;

  // Both brands cross-dissolve at the same instant
  const FADE_START = TRAVEL_DURATION - 0.22;
  const FADE_DUR   = 0.22;

  return (
    <motion.div
      className="fixed z-[70] pointer-events-none"
      style={{ top: navTop, left: navLeft, transformOrigin: "top left", visibility: hidden ? "hidden" : "visible" }}

      /*
       * initial={false} — tells Framer Motion not to animate from
       * defaults on mount; snaps immediately to `animate` values.
       */
      initial={false}

      animate={
        gone
          ? { x: 0,      y: 0,      scale: 1,         opacity: 0 }
          : { x: startX, y: startY, scale: heroScale,  opacity: 1 }
      }

      transition={{
        x:       { duration: TRAVEL_DURATION, ease: [0.32, 0.72, 0, 1] },
        y:       { duration: TRAVEL_DURATION, ease: [0.32, 0.72, 0, 1] },
        scale:   { duration: TRAVEL_DURATION, ease: [0.32, 0.72, 0, 1] },
        // going to navbar → fade out near the end of travel
        // returning to hero → fade in at start of travel (cross-dissolve)
        opacity: gone
          ? { delay: FADE_START, duration: FADE_DUR }
          : { duration: FADE_DUR },
      }}
    >
      <span
        className="font-script text-white whitespace-nowrap select-none"
        style={{ fontSize: FONT_PX, letterSpacing: "-0.01em" }}
      >
        gh<BlinkingOo />mo.w<RotatingGlobe />rld
      </span>
    </motion.div>
  );
}
