"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Big centered logo shown at the top of the hero on page load, fading out
 * once the user scrolls past the hero (in sync with Navbar's own fade-in
 * of the compact logo, both driven by the same scroll threshold).
 */
export default function BrandReveal({ hidden = false }: { hidden?: boolean }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const t = e.target;
      let scrollY: number;
      if (t === document || t === document.documentElement || t === document.body) {
        scrollY = window.scrollY;
      } else if (t instanceof HTMLElement && t.tagName === "MAIN") {
        scrollY = t.scrollTop;
      } else {
        return; // Not the page scroll container — ignore.
      }
      setGone(scrollY > 10);
    };
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <motion.div
      className="fixed top-20 left-1/2 z-[70] pointer-events-none flex flex-col items-center"
      style={{ x: "-50%", visibility: hidden ? "hidden" : "visible" }}
      initial={false}
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src="/images/brand/logo-gold-icon.png"
        alt=""
        width={760}
        height={760}
        priority
        className="h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 select-none"
      />
      <span
        className="font-script text-white/70 whitespace-nowrap mt-2 sm:mt-2.5 md:mt-3 text-sm sm:text-base md:text-lg"
        style={{ letterSpacing: "-0.01em" }}
      >
        Bidesh and Beyond
      </span>
    </motion.div>
  );
}
