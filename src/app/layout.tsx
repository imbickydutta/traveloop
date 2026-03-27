import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TraveLoop — Group Travel, Full Vibe",
    template: "%s | TraveLoop",
  },
  description:
    "Join epic group trips to Egypt, Kenya, Bali and more. Or get a curated plan built just for you. Trips set hai. Full vibe check.",
  keywords: ["group travel", "travel packages", "egypt trip", "kenya safari", "bali travel", "india travel group"],
  openGraph: {
    title: "TraveLoop — Group Travel, Full Vibe",
    description:
      "Join epic group trips to Egypt, Kenya, Bali and more. Trips set hai. Full vibe check.",
    type: "website",
    locale: "en_IN",
    siteName: "TraveLoop",
  },
  twitter: {
    card: "summary_large_image",
    title: "TraveLoop — Group Travel, Full Vibe",
    description: "Join epic group trips. Trips set hai. Full vibe check.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
