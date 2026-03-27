"use client";

import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { TRIPS } from "@/data/trips";
import { TripPageConfig } from "@/types/trip";

const THAILAND = TRIPS.find((t) => t.slug === "thailand-vibes")!;

const IMGS = [
  "/images/trips/thailand/thailand-1.jpg",
  "/images/trips/thailand/thailand-2.jpg",
  "/images/trips/thailand/thailand-3.jpg",
  "/images/trips/thailand/thailand-4.jpg",
];

const config: TripPageConfig = {
  trip:   THAILAND,
  accent: "#f72585",

  heroImage:   "/images/trips/thailand/thailand-1.jpg",
  heroLabel:   "🇹🇭 Thailand · Land of Smiles",
  heroTitle:   "Thailand Vibes",
  heroTagline: "Grand Palaces, vibrant night bazaars, Pattaya's golden beaches and the untouched paradise of Krabi & Phi Phi — 9 days of pure Thailand magic.",
  heroStats: [
    { label: "Dates",    value: "20 – 28 Jul"  },
    { label: "Duration", value: "8N · 9D"       },
    { label: "Booking",  value: "₹72,000"       },
    { label: "Final",    value: "USD 480"        },
  ],

  introLines: [
    "Gilded temples rising above Bangkok's skyline, the electric buzz of Pattaya's beachfront, dramatic limestone karsts plunging into turquoise waters at Krabi, and the crystal-clear coves of Phi Phi Island where the sea glows like liquid sapphire.",
    "Four incredible destinations, one unforgettable journey — <span class=\"text-white font-semibold\">join Bidhan Bar Vlogs for 9 days across the very best of Thailand.</span>",
  ],

  marqueeDestinations: ["Bangkok", "Pattaya", "Krabi", "Phi Phi", "Railay Beach", "Coral Island", "Ao Nang"],

  days: [
    { day: 0, date: "20 July",  location: "Kolkata → Bangkok",
      title: "The Adventure Begins",         image: IMGS[0], side: "left",
      bullets: ["Depart from Kolkata (or any city) to Bangkok", "Arrive at Suvarnabhumi International Airport — greeted by our Thai rep"] },
    { day: 1, date: "21 July",  location: "Bangkok",
      title: "City of Golden Temples",       image: IMGS[1], side: "right",
      bullets: ["Grand Palace & Wat Phra Kaew — the Emerald Buddha", "Wat Arun (Temple of Dawn) + Chao Phraya river cruise at sunset"] },
    { day: 2, date: "22 July",  location: "Bangkok",
      title: "Markets & Street Life",        image: IMGS[2], side: "left",
      bullets: ["Damnoen Saduak Floating Market — breakfast on a boat", "Wat Pho (Reclining Buddha) + Chatuchak Weekend Market or Asiatique Riverfront"] },
    { day: 3, date: "23 July",  location: "Bangkok → Pattaya",
      title: "Hello, Pattaya",               image: IMGS[3], side: "right",
      bullets: ["Scenic 2-hour coach journey to the Gulf of Thailand coast", "Check in at 4★ beachfront resort + evening stroll on Walking Street"] },
    { day: 4, date: "24 July",  location: "Pattaya",
      title: "Coral Island & the Coast",     image: IMGS[0], side: "left",
      bullets: ["Full-day speedboat trip to Koh Larn (Coral Island)", "Snorkelling, parasailing & beach BBQ lunch on the island"] },
    { day: 5, date: "25 July",  location: "Pattaya → Krabi",
      title: "Into Paradise",                image: IMGS[1], side: "right",
      bullets: ["Morning at Sanctuary of Truth — hand-carved wooden marvel", "Fly Pattaya → Krabi | Check in to resort in Ao Nang"] },
    { day: 6, date: "26 July",  location: "Krabi · Railay Beach",
      title: "Railay & Limestone Cliffs",    image: IMGS[2], side: "left",
      bullets: ["Long-tail boat to Railay Beach — only accessible by sea", "Phra Nang Cave Beach + four islands sunset boat tour"] },
    { day: 7, date: "27 July",  location: "Phi Phi Islands",
      title: "The Islands of Paradise",      image: IMGS[3], side: "right",
      bullets: ["Full-day island-hopping to Koh Phi Phi & Maya Bay (The Beach)", "Monkey Beach, Viking Cave, snorkelling in crystal-clear waters"] },
    { day: 8, date: "28 July",  location: "Krabi → Bangkok → Kolkata",
      title: "Farewell, Thailand",           image: IMGS[0], side: "left",
      bullets: ["Tiger Cave Temple — 1,237 steps to panoramic Krabi views", "Transfer to airport | Fly home with a lifetime of memories"] },
  ],

  inclusions: [
    "Return international flights (Kolkata – Bangkok – Kolkata)",
    "Domestic flight (Pattaya → Krabi)",
    "Return airport transfers in Thailand",
    "4★ & above hotels throughout (Bangkok, Pattaya, Krabi)",
    "Daily breakfast | Selected lunches & dinners",
    "Coral Island speedboat day trip with lunch",
    "Phi Phi Islands full-day island-hopping tour",
    "Long-tail boat to Railay Beach",
    "All sightseeing with entrance tickets",
    "Dedicated Bengali Trip Managers from India",
    "Thailand visa assistance (e-Visa on Arrival)",
  ],

  exclusions: [
    "Optional activities (ATV, zip-line, parasailing, diving, etc.)",
    "Tips & gratuities — approx. ฿200/day per person (~฿1,600 total)",
    "Travel & medical insurance",
    "Personal expenses & shopping",
    "Packaged drinking water & beverages",
    "Alcoholic & non-alcoholic drinks",
    "Additional hotel charges (Wi-Fi, minibar, room service)",
    "Anything not mentioned in Inclusions",
  ],

  bookingAmount: "₹72,000",
  finalPayment:  "USD 480",
  bookingInfoLines: [
    "📞 +91 70037 99172",
    "📩 Send passport copy (first & last page) + booking amount to confirm",
    "🎟 Flight tickets issued within 2–3 hours after payment confirmation",
  ],

  disclaimers: [
    {
      title: "Natural Calamities & Itinerary Changes",
      body: "In the event of natural calamities, rough seas due to weather, government disruptions, or any force majeure situation, Bidhan Bar Vlogs and the trip leaders shall not be responsible for issuing refunds or compensating for missed experiences. Phi Phi Islands and Railay Beach boat trips are subject to sea conditions and may be rescheduled or cancelled at the discretion of the local operators for safety reasons.",
    },
    {
      title: "Strict Time Management Policy",
      body: "All local services — hotels, transfers, ferries, and flights — operate on fixed schedules. Guests must report at the designated pickup points at the assigned time without exception. Delays will not be accommodated and vehicles/boats will depart as scheduled. If a guest arrives late, they will be required to reach the next location independently at their own cost. Guests who choose to opt out of any activity will not receive refunds or alternative meal arrangements.",
    },
    {
      title: "Respect Local Culture & Laws",
      body: "Thailand enforces strict laws around temple dress codes, public conduct, and respect for the monarchy. Guests are expected to dress modestly at temples (covered shoulders and knees), behave respectfully at all religious sites, and comply with all local laws and regulations throughout the trip. Any violation of local laws is the sole responsibility of the individual.",
    },
  ],
};

export default function ThailandVibesPage() {
  return <TripPageTemplate {...config} />;
}
