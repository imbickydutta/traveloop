import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bali Vibes — 8-Day Group Trip",
  description:
    "Temples, rice terraces, island escapes and sunsets that melt into the horizon — 8 days in Bali from ₹55,000 per person.",
  openGraph: {
    title: "Bali Vibes — ghoomo world",
    description:
      "8 days in Bali: Ubud, Nusa Penida & Tanah Lot. Temples, rice terraces & island sunsets. Group trip from ₹55,000.",
    type: "website",
    siteName: "ghoomo world",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bali Vibes — ghoomo world",
    description: "8 days in Bali: temples, rice terraces & sunsets. Group trip from ₹55,000.",
  },
};

export default function BaliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
