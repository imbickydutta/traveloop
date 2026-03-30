import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kenya Safari — 9-Day Group Trip",
  description:
    "Big Five, Maasai Mara & Amboseli — 9 days through the wild heart of Africa. Join our group safari from ₹65,000 per person.",
  openGraph: {
    title: "Kenya Safari — ghoomo world",
    description:
      "9 days through Kenya's wild heart: Maasai Mara, Amboseli & Lake Nakuru. Group safari from ₹65,000.",
    type: "website",
    siteName: "ghoomo world",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Safari — ghoomo world",
    description: "9 days in Kenya: Big Five await. Group trip from ₹65,000.",
  },
};

export default function KenyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
