import prisma from "@/app/libs/prismadb";
import { addDays, differenceInCalendarDays, isWithinInterval } from "date-fns";

type IParams = {
  listingId?: string;
  userId?: string;
  authorId?: string;
};

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = await params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = {
        userId: authorId,
      };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fiyat hesaplama
    const safeReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const { startDate, endDate, listing } = reservation;
        const totalDays = differenceInCalendarDays(endDate, startDate);

        const priceEntries = await prisma.listingPrice.findMany({
          where: {
            listingId: listing.id,
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        });

        let totalPrice = 0;
        for (let i = 0; i < totalDays; i++) {
          const currentDate = addDays(startDate, i);
          const specialPrice = priceEntries.find((entry) =>
            isWithinInterval(currentDate, {
              start: entry.startDate,
              end: entry.endDate,
            })
          );
          totalPrice += specialPrice ? specialPrice.price : listing.price;
        }

        return {
          ...reservation,
          totalPrice, // Opsiyonel: Hesaplanan fiyatı override etmek istersen.
          createdAt: reservation.createdAt.toISOString(),
          startDate: reservation.startDate.toISOString(),
          endDate: reservation.endDate.toISOString(),
          listing: {
            ...reservation.listing,
            createdAt: reservation.listing.createdAt.toISOString(),
          },
        };
      })
    );

    return safeReservations;
  } catch (error: any) {
    console.log(error)
    return null
  }
}
