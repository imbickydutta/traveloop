"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Trip } from "@/types/trip";

const WHATSAPP_NUMBER = "919999999999"; // replace with real number

interface Props {
  trip: Trip;
  onClose: () => void;
}

const TRAVELLER_OPTIONS = [1, 2, 3, 4, 5];

export default function TalkToUsModal({ trip, onClose }: Props) {
  const [travellers, setTravellers] = useState(2);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Build the default message whenever traveller count changes
  useEffect(() => {
    setMessage(
      `Hi! I'm interested in the *${trip.name}* trip.\n` +
        `📅 Dates: ${trip.dateDisplay} (${trip.durationShort})\n` +
        `👥 Group size: ${travellers} traveller${travellers > 1 ? "s" : ""}\n\n` +
        `Could you share the full itinerary and availability? Thanks!`
    );
  }, [trip, travellers]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-sm z-10"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-5 pt-5 pb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">
                  Plan Your Trip
                </p>
                <h3 className="text-white font-black text-lg leading-tight">
                  {trip.name}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  {trip.dateDisplay} · {trip.durationShort}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors p-1 -mr-1 -mt-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-5 flex flex-col gap-5">
              {/* Traveller count */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5">
                  How many travellers?
                </p>
                <div className="flex gap-2">
                  {TRAVELLER_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setTravellers(n)}
                      className="flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                      style={{
                        background:
                          travellers === n
                            ? trip.accentColor
                            : "rgba(255,255,255,0.05)",
                        color: travellers === n ? "#000" : "rgba(255,255,255,0.5)",
                        border:
                          travellers === n
                            ? `1px solid ${trip.accentColor}`
                            : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {n === 5 ? "5+" : n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5">
                  Your Message
                </p>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full resize-none text-sm text-white/80 leading-relaxed rounded-xl px-4 py-3 outline-none focus:ring-1 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    caretColor: trip.accentColor,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${trip.accentColor}55`;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${trip.accentColor}15`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <p className="text-[10px] text-white/25 mt-1.5">
                  Feel free to edit this before sending.
                </p>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "#25d366",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                }}
              >
                <WhatsAppIcon />
                Send on WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
