"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "@phosphor-icons/react";
import { Trip } from "@/types/trip";
import { createLead, type LeadTravellerType, type LeadSource } from "@/lib/api/leads";

const WHATSAPP_NUMBER = "917001347896";
const DEFAULT_ACCENT = "#00e676"; // brand green for non-trip-specific use

interface Props {
  /** When omitted (e.g. floating button), the modal switches to a general-inquiry mode. */
  trip?: Trip;
  source?: LeadSource;
  onClose: () => void;
}

const TRAVELLER_OPTIONS = [1, 2, 3, 4, 5];
const TRAVELLER_TYPES: { value: LeadTravellerType; label: string }[] = [
  { value: "solo",   label: "Solo"   },
  { value: "couple", label: "Couple" },
  { value: "group",  label: "Group"  },
  { value: "family", label: "Family" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function TalkToUsModal({ trip, source, onClose }: Props) {
  const accent = trip?.accentColor ?? DEFAULT_ACCENT;
  const resolvedSource: LeadSource = source ?? "talk_to_us";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [travellerType, setTravellerType] = useState<LeadTravellerType>("solo");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [travellers, setTravellers] = useState(2);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Build the default message whenever traveller count or trip changes
  useEffect(() => {
    if (trip) {
      setMessage(
        `Hi! I'm interested in the *${trip.name}* trip.\n` +
          `📅 Dates: ${trip.dateDisplay} (${trip.durationShort})\n` +
          `👥 Group size: ${travellers} traveller${travellers > 1 ? "s" : ""}\n\n` +
          `Could you share the full itinerary and availability? Thanks!`
      );
    } else {
      setMessage(
        `Hi! I'd like to know more about your upcoming trips.\n` +
          `👥 Group size: ${travellers} traveller${travellers > 1 ? "s" : ""}\n\n` +
          `Could you share what's available? Thanks!`
      );
    }
  }, [trip, travellers]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock page scroll while the modal is open — otherwise touch-scrolling the
  // modal bubbles up and scrolls the page, which the Navbar treats as the user
  // returning to the top and un-collapses the brand reveal. The home page's
  // scroll container is <main>, not <body>, so we lock both.
  useEffect(() => {
    const mainEl = document.querySelector("main") as HTMLElement | null;
    const prevMain = mainEl?.style.overflow ?? "";
    const prevBody = document.body.style.overflow;
    if (mainEl) mainEl.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      if (mainEl) mainEl.style.overflow = prevMain;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const phoneDigits = phone.replace(/\D/g, "");
  const canSubmit =
    name.trim().length > 0 && phoneDigits.length >= 10 && status !== "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      await createLead({
        name: name.trim(),
        phone: phone.trim(),
        travellerType,
        ...(trip ? { tripInterested: trip.slug } : {}),
        source: resolvedSource,
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
      setStatus("error");
    }
  };

  const openWhatsAppFallback = () => {
    const text = trip
      ? `Hi, I'm interested in ${trip.name}`
      : "Hi, I'd like to know about your trips";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Portal target only exists on the client — defer until mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const modal = (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center px-0 sm:items-center sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-black/70 sm:backdrop-blur-sm" />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-none sm:max-w-sm z-10"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[90vh]"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-5 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">
                  {trip ? "Plan Your Trip" : "Talk To Us"}
                </p>
                <h3 className="text-white font-black text-lg leading-tight">
                  {trip ? trip.name : "Get in touch"}
                </h3>
                {trip && (
                  <p className="text-white/40 text-xs mt-0.5">
                    {trip.dateDisplay} · {trip.durationShort}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors p-1 -mr-1 -mt-1"
                aria-label="Close"
              >
                <X size={18} weight="light" />
              </button>
            </div>

            {/* Body */}
            {status === "success" ? (
              <div className="px-5 py-8 pb-[max(env(safe-area-inset-bottom),2rem)] sm:pb-8 flex flex-col items-center text-center gap-5 overflow-y-auto">
                <CheckCircle size={56} weight="fill" color={accent} />
                <div>
                  <h4 className="text-white font-black text-base leading-tight">
                    We&rsquo;ll WhatsApp you within the hour!
                  </h4>
                  <p className="text-white/40 text-xs mt-1.5">
                    Hang tight — our team will reach out shortly.
                  </p>
                </div>
                <button
                  onClick={openWhatsAppFallback}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: "#25d366",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                  }}
                >
                  <WhatsAppIcon />
                  Message us directly
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 py-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] sm:pb-5 flex flex-col gap-5 overflow-y-auto">
                {/* Name */}
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5"
                  >
                    Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full text-sm text-white/90 rounded-xl px-4 py-3 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      caretColor: accent,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${accent}55`;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}15`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5"
                  >
                    Phone
                  </label>
                  <div className="flex">
                    <span
                      className="inline-flex items-center px-3 text-sm text-white/50 rounded-l-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRight: "none",
                      }}
                    >
                      +91
                    </span>
                    <input
                      id="lead-phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="98765 43210"
                      className="flex-1 text-sm text-white/90 rounded-r-xl px-4 py-3 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        caretColor: accent,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = `${accent}55`;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}15`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Travelling as */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5">
                    Travelling as
                  </p>
                  <div className="flex gap-2">
                    {TRAVELLER_TYPES.map((opt) => {
                      const selected = travellerType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setTravellerType(opt.value)}
                          className="flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                          style={{
                            background: selected
                              ? accent
                              : "rgba(255,255,255,0.05)",
                            color: selected ? "#000" : "rgba(255,255,255,0.5)",
                            border: selected
                              ? `1px solid ${accent}`
                              : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Traveller count */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 mb-2.5">
                    How many travellers?
                  </p>
                  <div className="flex gap-2">
                    {TRAVELLER_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setTravellers(n)}
                        className="flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                        style={{
                          background:
                            travellers === n
                              ? accent
                              : "rgba(255,255,255,0.05)",
                          color: travellers === n ? "#000" : "rgba(255,255,255,0.5)",
                          border:
                            travellers === n
                              ? `1px solid ${accent}`
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
                      caretColor: accent,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${accent}55`;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}15`;
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  style={{
                    background: accent,
                    color: "#000",
                    boxShadow: `0 4px 20px ${accent}59`,
                  }}
                >
                  {status === "submitting" ? "Sending…" : "Submit"}
                </button>

                {status === "error" && (
                  <div className="flex flex-col gap-3 -mt-2">
                    <p className="text-xs text-red-400 text-center">
                      Something went wrong. Please WhatsApp us directly.
                      {errorMsg && (
                        <span className="block text-white/30 mt-1">{errorMsg}</span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={openWhatsAppFallback}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: "#25d366",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                      }}
                    >
                      <WhatsAppIcon />
                      Message us directly
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
    </svg>
  );
}
