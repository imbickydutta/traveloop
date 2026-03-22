import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chalo Vibe — Group Travel, Full Vibe",
    template: "%s | Chalo Vibe",
  },
  description:
    "Join epic group trips to Egypt, Kenya, Bali and more. Or get a curated plan built just for you. Trips set hai. Full vibe check.",
  keywords: ["group travel", "travel packages", "egypt trip", "kenya safari", "bali travel", "india travel group"],
  openGraph: {
    title: "Chalo Vibe — Group Travel, Full Vibe",
    description:
      "Join epic group trips to Egypt, Kenya, Bali and more. Trips set hai. Full vibe check.",
    type: "website",
    locale: "en_IN",
    siteName: "Chalo Vibe",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chalo Vibe — Group Travel, Full Vibe",
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
