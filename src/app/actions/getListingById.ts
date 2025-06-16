import prisma from "@/app/libs/prismadb";
import { SafeListing } from "../types";

type Params = {
  listingId?: string;
};

export default async function getListingById(params: Params): Promise<SafeListing | null> {
  try {
    const { listingId } = await params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
        prices: true, // tüm alanları içeriyor
      },
    });

    if (!listing) return null;

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
     prices: listing.prices.map((price) => ({
  id: price.id,
  listingId: price.listingId,
  price: price.price,
  startDate: price.startDate.toISOString(),
  endDate: price.endDate.toISOString(),
})),

    };
  } catch (error: any) {
    throw new Error(error);
  }
}
