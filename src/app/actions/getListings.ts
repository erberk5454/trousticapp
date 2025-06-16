// app/actions/getListings.ts
import prisma from "@/app/libs/prismadb";



export interface ListingParams {
  userId?: string;
  page?: number;
  limit?: number;
}

export default async function getListings(
  params
: ListingParams)  {
  try {
    
    const{userId,page=1,limit=24}=params
    const skip = (page - 1) * limit;
    let query:any={}
    if(userId){query.userId=userId}

    const listings = await prisma.listing.findMany({
      where:query,
      orderBy: {
        createdAt: "desc",
      },
      include:{
        prices:true,
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.listing.count();
    const totalPages = Math.ceil(totalCount / limit);

  const safeListings = listings.map((listing) => ({
  ...listing,
  createdAt: listing.createdAt.toISOString(),
  prices: listing.prices.map((price) => ({
    ...price,
    startDate: price.startDate.toISOString(),
    endDate: price.endDate.toISOString(),
  })),
}));
    return {
      listings: safeListings,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}