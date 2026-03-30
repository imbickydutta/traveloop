import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egypt Vibes — 11-Day Group Trip",
  description:
    "Pyramids, Nile cruises & the Red Sea — 11 days through the greatest civilisation ever known. Join our group trip from ₹95,000 per person.",
  openGraph: {
    title: "Egypt Vibes — ghoomo world",
    description:
      "11 days through ancient Egypt: Pyramids of Giza, Nile Cruise, Abu Simbel & the Red Sea. Group trip from ₹95,000.",
    type: "website",
    siteName: "ghoomo world",
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Vibes — ghoomo world",
    description: "11 days through ancient Egypt. Group trip from ₹95,000.",
  },
};

export default function EgyptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
