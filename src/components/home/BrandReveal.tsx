"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ── Timing — Navbar reads TRAVEL_DURATION to sync its fade-in ── */
export const TRAVEL_DURATION = 0.75;

const FONT_PX    = 21;
const NAV_HEIGHT = 64;
const APPROX_W   = 114;   // "TraveLoop" approx width at 21px Inter Black
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

/* ── Blinking 'oo' ── */
export function BlinkingOo({ subtle = false }: { subtle?: boolean }) {
  const dim = subtle ? 0.5 : 0.07;
  return (
    <>
      <motion.span
        className="text-[#00e676]"
        animate={{ opacity: [1, dim, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        o
      </motion.span>
      <motion.span
        className="text-[#00e676]"
        animate={{ opacity: [1, dim, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        o
      </motion.span>
    </>
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
        className="font-black text-white whitespace-nowrap select-none"
        style={{ fontSize: FONT_PX, letterSpacing: "-0.025em" }}
      >
        TraveL<BlinkingOo />p
      </span>
    </motion.div>
  );
}
