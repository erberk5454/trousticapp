import prisma from "@/app/libs/prismadb";
import { addDays, differenceInCalendarDays, isWithinInterval } from "date-fns";

export const calculateReservationPrice = async ({
  listingId,
  startDate,
  endDate,
  defaultPrice,
}: {
  listingId: string;
  startDate: Date;
  endDate: Date;
  defaultPrice: number;
}): Promise<number> => {
  const totalDays = differenceInCalendarDays(endDate, startDate);

  const priceEntries = await prisma.listingPrice.findMany({
    where: {
      listingId,
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
    totalPrice += specialPrice ? specialPrice.price : defaultPrice;
  }

  return totalPrice;
};
