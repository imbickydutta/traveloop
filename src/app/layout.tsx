import type { Metadata } from "next";
import { Outfit, Comfortaa } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const comfortaa = Comfortaa({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ghoomo.world — Group Travel, Full Vibe",
    template: "%s | ghoomo.world",
  },
  description:
    "Join epic group trips to Egypt, Kenya, Bali and more. Or get a curated plan built just for you. Trips set hai. Full vibe check.",
  keywords: ["group travel", "travel packages", "egypt trip", "kenya safari", "bali travel", "india travel group"],
  openGraph: {
    title: "ghoomo.world — Group Travel, Full Vibe",
    description:
      "Join epic group trips to Egypt, Kenya, Bali and more. Trips set hai. Full vibe check.",
    type: "website",
    locale: "en_IN",
    siteName: "ghoomo.world",
  },
  twitter: {
    card: "summary_large_image",
    title: "ghoomo.world — Group Travel, Full Vibe",
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
    <html lang="en" className={`${outfit.variable} ${comfortaa.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
