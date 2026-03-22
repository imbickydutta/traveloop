"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BrandReveal, { BlinkingOo, TRAVEL_DURATION } from "@/components/home/BrandReveal";

const NAV_LINKS = [
  { label: "Website", href: "/" },
  { label: "Highlights", href: "/#highlights" },
  { label: "Routes", href: "/#lineup" },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  // True once the user scrolls — syncs with BrandReveal's scroll trigger
  const [brandVisible, setBrandVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setBrandVisible(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Brand reveal — hidden when mobile menu is open ── */}
      <BrandReveal hidden={mobileOpen} />

      {/* ── Header — z-[65] so it always sits above the mobile overlay ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[65]"
        style={{
          background:           "transparent",
          borderBottom:         "none",
          transition:           "none",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo — fades in as BrandReveal finishes its travel */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="TraveLoop home">
            <motion.span
              className="text-xl font-black text-white whitespace-nowrap"
              style={{ letterSpacing: "-0.025em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: brandVisible ? 1 : 0 }}
              transition={{
                // mirror BrandReveal's crossfade: FADE_START = TRAVEL_DURATION - 0.22
                delay:    brandVisible ? TRAVEL_DURATION - 0.22 : 0,
                duration: 0.22,
              }}
            >
              TraveL<BlinkingOo subtle />p
            </motion.span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00e676] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe59] text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
            >
              <WhatsAppIcon />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile hamburger → X morphing button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg
              viewBox="0 0 22 22"
              width={22}
              height={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <motion.line
                x1="2" y1="5" x2="20" y2="5"
                animate={mobileOpen ? { x1: 3, y1: 3, x2: 19, y2: 19 } : { x1: 2, y1: 5, x2: 20, y2: 5 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.line
                x1="2" y1="11" x2="20" y2="11"
                animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                style={{ originX: "50%", originY: "50%" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.line
                x1="2" y1="17" x2="20" y2="17"
                animate={mobileOpen ? { x1: 3, y1: 19, x2: 19, y2: 3 } : { x1: 2, y1: 17, x2: 20, y2: 17 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile Menu Overlay — z-[55] (above BrandReveal z-45, below header z-65) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-[#0a0a0a] flex flex-col pt-20 px-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <ul className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className="text-3xl font-bold text-white hover:text-[#00e676] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25d366] text-white text-base font-semibold px-6 py-4 rounded-full w-full"
                onClick={() => setMobileOpen(false)}
              >
                <WhatsAppIcon />
                WhatsApp Us
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
    </svg>
  );
}
