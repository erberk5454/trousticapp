import { User, Listing, Reservation, ListingPrice } from "@prisma/client";

// types/index.ts

import { LatLngTuple } from "leaflet";

export interface RentFormValues {
  category: string;
  location: {
    label: string;
    latlng: LatLngTuple;
    addressDetails?: any;
  } | null;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: string;
  title: string;
  description: string;
  price: number;
}


export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  user?: SafeUser;
  prices?: {
    id: string;
    listingId: string;
    price: number;
    startDate: string;
    endDate: string;
    prices?:ListingPrice[]
  }[];
};


export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};
