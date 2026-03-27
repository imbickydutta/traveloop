"use client";

import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { TRIPS } from "@/data/trips";
import { TripPageConfig } from "@/types/trip";

const BALI = TRIPS.find((t) => t.slug === "bali-vibes")!;

const config: TripPageConfig = {
  trip:   BALI,
  accent: "#00d4aa",

  heroImage:   "/images/trips/bali/bali-1.jpg",
  heroLabel:   "🇮🇩 Indonesia · Island of the Gods",
  heroTitle:   "Bali Vibes",
  heroTagline: "Terraced rice fields, volcanic temples, crystal-blue islands and sunsets that melt into the horizon — Bali awaits.",
  heroStats: [
    { label: "Dates",    value: "04 – 12 Apr" },
    { label: "Duration", value: "7N · 8D"     },
    { label: "Booking",  value: "₹55,000"     },
    { label: "Final",    value: "USD 510"      },
  ],

  introLines: [
    "Emerald rice terraces cascading down volcanic hillsides, ancient Hindu temples perched on clifftops above crashing waves, turquoise waters lapping at white sand beaches, and the intoxicating scent of incense at every corner.",
    "This is not just a holiday — <span class=\"text-white font-semibold\">this is Bali in its most vivid form.</span> Join Bidhan Bar Vlogs on an 8-day journey through the Island of the Gods.",
  ],

  marqueeDestinations: ["Kintamani", "Ubud", "Bedugul", "Nusa Penida", "Tanah Lot", "Uluwatu"],

  days: [
    { day: 0, date: "04 April", location: "Kolkata → Bali",
      title: "The Journey Begins",        image: "/images/trips/bali/bali-1.jpg", side: "left",
      bullets: ["Meet-up at Kolkata Airport", "Depart via Kuala Lumpur / Singapore / Thailand"] },
    { day: 1, date: "05 April", location: "Bali",
      title: "Welcome to Bali",           image: "/images/trips/bali/bali-2.jpg", side: "right",
      bullets: ["Pick-up from Ngurah Rai International Airport", "Welcome dinner at an Indian Restaurant"] },
    { day: 2, date: "06 April", location: "Kintamani · Ubud",
      title: "Volcanoes & Rice Terraces", image: "/images/trips/bali/bali-3.jpg", side: "left",
      bullets: ["Mount Batur Volcano viewpoint in Kintamani", "Tegalalang Rice Terrace & Tegenungan Waterfall"] },
    { day: 3, date: "07 April", location: "Bedugul · Tanah Lot",
      title: "Temples & Sunset Magic",    image: "/images/trips/bali/bali-1.jpg", side: "right",
      bullets: ["Ulun Danu Temple at Beratan Lake + Handara Gate", "Magical sunset at Tanah Lot Temple"] },
    { day: 4, date: "08 April", location: "Lempuyang · Tirta Gangga",
      title: "Gate of Heaven",            image: "/images/trips/bali/bali-2.jpg", side: "left",
      bullets: ["Lempuyang Temple — the iconic Gate of Heaven", "Royal Tirta Gangga Water Palace"] },
    { day: 5, date: "09 April", location: "Nusa Penida Island",
      title: "Island of Wonders",         image: "/images/trips/bali/bali-3.jpg", side: "right",
      bullets: ["Crystal Bay, Broken Beach & Angel's Billabong", "Kelingking Cliff — Bali's most iconic viewpoint"] },
    { day: 6, date: "10 April", location: "South Bali · Uluwatu",
      title: "Culture & Coastline",       image: "/images/trips/bali/bali-1.jpg", side: "left",
      bullets: ["Melasti Beach + optional water sports at Nusa Dua", "Uluwatu Temple & Kecak Dance Show"] },
    { day: 7, date: "11 April", location: "Bali",
      title: "Day at Leisure",            image: "/images/trips/bali/bali-2.jpg", side: "right",
      bullets: ["Explore spas, beach clubs & local markets", "Free day — your Bali, your way"] },
    { day: 8, date: "12 April", location: "Bali → Kolkata",
      title: "Farewell, Bali",            image: "/images/trips/bali/bali-3.jpg", side: "left",
      bullets: ["Breakfast at hotel, check-out", "Transfer to airport — depart with unforgettable memories"] },
  ],

  inclusions: [
    "Round-trip flights (Kolkata – Bali – Kolkata)",
    "4★ / 5★ category hotels throughout",
    "Visa assistance",
    "All sightseeing & airport transfers",
    "Entry tickets to all mentioned attractions (excluding optional activities)",
    "7× Breakfast | 5× Lunch | 7× Dinner",
    "Dedicated Trip Managers throughout the tour",
  ],

  exclusions: [
    "Packaged drinking water",
    "Alcoholic or soft drinks",
    "Tips & gratuities — approx. $3 USD/day per person (~$25 total)",
    "Optional activities (Bali Swing, ATV, River Rafting, Water Sports, etc.)",
    "Anything not mentioned in the inclusions",
  ],

  bookingAmount: "₹55,000",
  finalPayment:  "USD 510",
  bookingInfoLines: [
    "📞 +91 70037 99172",
    "📩 Send passport copy (first & last page) + booking amount to confirm",
    "🎟 Flight tickets issued within 2–3 hours after payment confirmation",
  ],

  disclaimers: [
    {
      title: "Natural Calamities & Itinerary Changes",
      body: "If there are any natural calamities, traffic disruptions, rough seas due to weather, or government protests, Bidhan Bar Vlogs or the trip leaders won't be responsible for refunds or covering missed places on a separate date. Day excursions will be subject to change and switching on a different date if situational changes affect the group.",
    },
    {
      title: "Strict Time Management Policy",
      body: "Indonesia operates with a strict culture of punctuality, and all local services adhere firmly to scheduled timings. Guests must be present at the designated pickup point or hotel lobby exactly at the assigned time. Delays will not be accommodated, and vehicles will depart as scheduled without exception. If a guest arrives late, the group will proceed as planned and the delayed guest will be required to reach the next location independently at their own cost. Guests who choose to stay back during scheduled activities will not receive meals or other arrangements for that day.",
    },
  ],

  // No custom slots needed for Bali — add here if required in future
};

export default function BaliVibesPage() {
  return <TripPageTemplate {...config} />;
}
