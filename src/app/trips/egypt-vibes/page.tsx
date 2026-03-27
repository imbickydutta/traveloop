"use client";

import TripPageTemplate from "@/components/trips/TripPageTemplate";
import { TRIPS } from "@/data/trips";
import { TripPageConfig } from "@/types/trip";

const EGYPT = TRIPS.find((t) => t.slug === "egypt-vibes")!;

const IMGS = [
  "/images/trips/egypt/egypt-pyramids.jpg",
  "/images/trips/egypt/egypt-2.jpg",
  "/images/trips/egypt/egypt-4.jpg",
  "/images/trips/egypt/egypt-1.avif",
];

const config: TripPageConfig = {
  trip:   EGYPT,
  accent: "#e8b84b",

  heroImage:   "/images/trips/egypt/egypt-pyramids.jpg",
  heroLabel:   "🇪🇬 Egypt · Where Pharaohs Left Their Mark",
  heroTitle:   "Egypt Vibes",
  heroTagline: "From the Pyramids of Giza to a Nile cruise at sunset — 11 days through the greatest civilisation the world has ever known.",
  heroStats: [
    { label: "Dates",    value: "23 Mar – 02 Apr" },
    { label: "Duration", value: "10N · 11D"        },
    { label: "Booking",  value: "₹95,000"          },
    { label: "Final",    value: "USD 1,150"         },
  ],

  introLines: [
    "Towering pyramids that have stood for 4,500 years, the enigmatic gaze of the Sphinx, a cruise down the world's longest river past temples carved into living rock, and the turquoise waters of the Red Sea — Egypt is not a destination, it is a civilisation.",
    "Experience the magic of ancient Egypt — from the Pyramids to the Nile, from the Mediterranean coast to the Red Sea paradise — <span class=\"text-white font-semibold\">with India's most adventurous travel community.</span>",
  ],

  marqueeDestinations: ["Cairo", "Alexandria", "Aswan", "Abu Simbel", "Luxor", "Hurghada", "Giza"],

  days: [
    { day: 0, date: "23 March", location: "Kolkata → Mumbai",
      title: "The Adventure Begins",        image: IMGS[1], side: "left",
      bullets: ["Fly from Kolkata (or any city) to Mumbai by 9:00 PM", "Pre-departure briefing with team leaders & fellow travellers"] },
    { day: 1, date: "24 March", location: "Cairo → Alexandria",
      title: "Pearl of the Mediterranean",  image: IMGS[2], side: "right",
      bullets: ["Land at Cairo Airport, greeted by our Egyptian rep", "Luxury Mercedes coach to Alexandria — Indian lunch en route"] },
    { day: 2, date: "25 March", location: "Alexandria → Cairo",
      title: "Wonders of Alexandria",       image: IMGS[3], side: "left",
      bullets: ["Catacombs of Kom El Shoqafa, Citadel of Qaitbay, Alexandria Library", "Seafood lunch by the harbour + Khan el-Khalili Bazaar shopping"] },
    { day: 3, date: "26 March", location: "Giza · Sakkara",
      title: "The Great Pyramids",          image: IMGS[0], side: "right",
      bullets: ["Great Pyramid of Khufu, the Sphinx & camel ride across the desert", "Step Pyramid of Djoser at Sakkara + overnight luxury sleeping train to Aswan"] },
    { day: 4, date: "27 March", location: "Aswan · Nile Cruise",
      title: "Temples on the Nile",         image: IMGS[2], side: "left",
      bullets: ["Check into 5★ Nile Cruise — your floating palace", "Philae Temple via Felucca ride & golden sunset over the Nile"] },
    { day: 5, date: "28 March", location: "Abu Simbel · Kom Ombo",
      title: "Ramses & the Sahara",         image: IMGS[1], side: "right",
      bullets: ["Sunrise drive to Abu Simbel — UNESCO-rescued temples of Ramses II", "Twin Temple of Sobek at Kom Ombo, sailing towards Edfu"] },
    { day: 6, date: "29 March", location: "Esna · Luxor",
      title: "The Esna Lock & Luxor",       image: IMGS[3], side: "left",
      bullets: ["Relaxed morning on the Nile — watch villages drift by", "Esna Lock engineering marvel + Luxor Temple at golden sunset"] },
    { day: 7, date: "30 March", location: "Luxor → Hurghada",
      title: "Valley of the Kings",         image: IMGS[0], side: "right",
      bullets: ["Valley of the Kings (Tutankhamun's tomb) + Karnak Temple", "Drive through desert highway to the Red Sea coast, Hurghada"] },
    { day: 8, date: "31 March", location: "Hurghada · Red Sea",
      title: "Red Sea Paradise",            image: IMGS[2], side: "left",
      bullets: ["Private beach, pool & unlimited soft drinks included", "Optional: Red Sea Island yacht cruise, snorkelling & lunch ($65)"] },
    { day: 9, date: "01 April", location: "Hurghada → Cairo",
      title: "The Grand Museum",            image: IMGS[1], side: "right",
      bullets: ["Coach back to Cairo with scenic desert & Red Sea views", "Grand Egyptian Museum — 100,000+ treasures including Tutankhamun collection"] },
    { day: 10, date: "02 April", location: "Cairo → Kolkata",
      title: "Farewell, Egypt",             image: IMGS[0], side: "left",
      bullets: ["Breakfast, check-out & transfer to Cairo International Airport", "Carry home a thousand memories of ancient Egypt"] },
  ],

  inclusions: [
    "International return flights (Kolkata – Cairo – Kolkata)",
    "Return airport transfers in Egypt",
    "4★ & above hotels in Alexandria, Cairo, Giza & Hurghada",
    "5★ Nile River Cruise (3 nights)",
    "Daily buffet breakfast, lunch & dinner",
    "All sightseeing with entrance tickets",
    "Professional English-speaking Egyptologist guide",
    "Overnight luxury sleeping train (Cairo – Aswan)",
    "Private Mercedes-Benz coach with onboard washroom",
    "Abu Simbel excursion",
  ],

  exclusions: [
    "Optional Hot Air Balloon Ride ($95 per person)",
    "Optional Felucca Ride",
    "Optional Red Sea activities (island excursions, snorkelling, jet ski, diving, parasailing, etc.)",
    "Tips & gratuities — approx. $9 USD/day per person (~$80 total)",
    "Travel & medical insurance",
    "Personal expenses & shopping",
    "Drinking water",
    "Alcoholic & non-alcoholic drinks",
    "Additional cruise bills (Wi-Fi, packaged water, tea/coffee, soft drinks)",
    "Washroom usage fees during road trips",
    "Anything not mentioned in Inclusions",
  ],

  bookingAmount: "₹95,000",
  finalPayment:  "USD 1,150",
  bookingInfoLines: [
    "📞 +91 70037 99172",
    "📩 Send passport copy (first & last page) + booking amount to confirm",
    "🎟 Flight tickets issued within 3–4 days after payment confirmation",
  ],

  disclaimers: [
    {
      title: "Natural Calamities & Force Majeure",
      body: "In the event of any natural calamities, traffic disruptions, government protests, riots, sudden closure of historical monuments, non-issuance of required police permissions, or war-like situations in the Middle East, Bidhan Bar Vlogs and the Trip Leaders shall not be held responsible for issuing refunds or compensating for any missed experiences, activities, or destinations arising from such circumstances. These situations are beyond our control and may prevent the itinerary from proceeding as planned. Day excursions are subject to change and may be shifted to an alternate date if required due to situational factors affecting the group.",
    },
    {
      title: "Physical Fitness & Time Management",
      body: "Egypt is a destination where extensive walking is required, especially at historical sites. If you are not physically fit to walk long distances or have any medical concerns, this trip may not be suitable for you. All locations operate under strict time regulations due to police permissions and fixed opening and closing hours. If you arrive late at any point, the entire group may be affected and we may have no option but to leave you behind — you will be required to reach the next location on your own and at your own cost. Guests who choose to stay back at the hotel will not have food arranged for them.",
    },
  ],
};

export default function EgyptVibesPage() {
  return <TripPageTemplate {...config} />;
}
