import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thailand Vibes — 9-Day Group Trip",
  description:
    "Bangkok, Pattaya, Krabi & Phi Phi Islands — 9 days of temples, street food, beaches and paradise. Group trip from ₹72,000 per person.",
  openGraph: {
    title: "Thailand Vibes — ghoomo world",
    description:
      "9 days in Thailand: Bangkok, Pattaya, Krabi & Phi Phi Islands. Temples, beaches & paradise vibes. Group trip from ₹72,000.",
    type: "website",
    siteName: "ghoomo world",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thailand Vibes — ghoomo world",
    description: "9 days in Thailand: temples, beaches & paradise islands. Group trip from ₹72,000.",
  },
};

export default function ThailandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
