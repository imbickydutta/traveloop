"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TalkToUsModal from "@/components/home/TalkToUsModal";

export default function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Hide on individual trip pages (per spec).
  if (pathname?.includes("/trips/")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Talk to us on WhatsApp"
        className="fixed right-[20px] bottom-[calc(env(safe-area-inset-bottom)+24px)] z-[50] w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "#25D366",
          boxShadow: "0 6px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(37,211,102,0.3)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <WhatsAppIcon />
      </button>

      {modalOpen && (
        <TalkToUsModal source="floating_button" onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#fff" className="w-6 h-6">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.882l6.198-1.626A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.003-1.373l-.358-.214-3.716.975.991-3.624-.233-.372A9.789 9.789 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182 17.43 2.182 21.818 6.57 21.818 12S17.43 21.818 12 21.818z" />
    </svg>
  );
}
