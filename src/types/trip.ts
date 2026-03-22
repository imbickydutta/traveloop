export type TripType = "group" | "curated";
export type TripStatus = "available" | "filling-fast" | "sold-out";

export interface Trip {
  id: string;
  slug: string;
  name: string;
  destination: string;
  tagline: string;

  /** Ordered list of images. images[0] is used as the cover / poster. */
  images: string[];
  videoUrl?: string;

  dateDisplay: string;
  durationShort: string;

  pricePerPaxINR: number;
  earlyBirdPercent?: number;

  attractions: string[];

  status: TripStatus;
  type: TripType;
  accentColor: string;

  seatsTotal?: number;
  seatsLeft?: number;
}
