// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { addDays, differenceInCalendarDays, eachDayOfInterval, format, isWithinInterval } from "date-fns";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { listingId, startDate, endDate, totalPrice } = await request.json();
  if (!listingId || !startDate || !endDate || totalPrice == null) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { price: true },
  });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Safe date adjustments (avoid timezone day shift)
  const start = new Date(startDate);
  start.setHours(12, 0, 0, 0);
  let end = new Date(endDate);
  end.setHours(12, 0, 0, 0);

  // Calculate days count excluding checkout day
  const calcEnd = addDays(end, -1);
  const days = eachDayOfInterval({ start, end: calcEnd });
  if (days.length < 1) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  // Fetch special prices in range
  const specialPrices = await prisma.listingPrice.findMany({
    where: {
      listingId,
      startDate: { lte: end },
      endDate: { gte: start },
    },
  });

  // Compute expected total
  let expectedTotal = 0;
  days.forEach((day) => {
    const key = format(day, 'yyyy-MM-dd');
    const entry = specialPrices.find((sp) =>
      isWithinInterval(day, { start: new Date(sp.startDate), end: new Date(sp.endDate) })
    );
    expectedTotal += entry ? entry.price : listing.price;
  });

  if (expectedTotal !== totalPrice) {
    return NextResponse.json(
      { error: "Price mismatch", expectedTotal, receivedTotal: totalPrice },
      { status: 400 }
    );
  }

  // Check for conflicts
  const conflict = await prisma.reservation.findFirst({
    where: {
      listingId,
      AND: [
        { startDate: { lte: end } },
        { endDate: { gte: start } },
      ],
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "This date range is already reserved." }, { status: 409 });
  }

  // Create reservation
  const reservation = await prisma.reservation.create({
    data: {
      listingId,
      userId: currentUser.id,
      startDate: start,
      endDate: end,
      totalPrice: expectedTotal,
    },
  });

  return NextResponse.json(reservation, { status: 201 });
}
