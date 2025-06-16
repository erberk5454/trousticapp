"use client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingReservation from "@/components/listings/ListingReservation";
import { categories } from "@/components/navbar/Categories";
import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import {
  differenceInCalendarDays,
  addDays,
  eachDayOfInterval,
  format,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Range } from "react-date-range";

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

type ListingClientProps = {
  reservations?: SafeReservation[];
  listing: SafeListing;
  currentUser?: SafeUser | null;
};

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const start = new Date(reservation.startDate);
      const end = addDays(new Date(reservation.endDate), -1);
      const range = eachDayOfInterval({ start, end });
      dates.push(...range);
    });
    return dates;
  }, [reservations]);

  const priceMap = useMemo(() => {
    const map: Record<string, number> = {};
    (listing.prices || []).forEach(
      (priceObj: { startDate: string; endDate: string; price: number }) => {
        const { startDate, endDate, price } = priceObj;
        eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate),
        }).forEach((d) => {
          map[format(d, "yyyy-MM-dd")] = price;
        });
      }
    );
    return map;
  }, [listing.prices]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) return loginModal.onOpen();
    if (!dateRange.startDate || !dateRange.endDate)
      return toast.error("Lütfen tarih aralığını seçin.");

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        listingId: listing.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        totalPrice,
      })
      .then(() => {
        toast.success("Rezervasyon başarıyla oluşturuldu!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => toast.error("Bir hata oluştu!"))
      .finally(() => setIsLoading(false));
  }, [currentUser, dateRange, listing.id, loginModal, router, totalPrice]);

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setTotalPrice(0);
      return;
    }

    const nights = differenceInCalendarDays(
      dateRange.endDate,
      dateRange.startDate
    );

    if (nights <= 0) {
      setTotalPrice(0);
      return;
    }

    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: addDays(dateRange.endDate, -1),
    });

    const sum = days.reduce((acc, day) => {
      const key = format(day, "yyyy-MM-dd");
      return acc + (priceMap[key] ?? listing.price);
    }, 0);

    setTotalPrice(sum);
  }, [dateRange, listing.price, priceMap]);

  const displayPrice = useMemo(() => {
    const nights = differenceInCalendarDays(
      dateRange.endDate || new Date(),
      dateRange.startDate || new Date()
    );

    if (nights > 0 && totalPrice > 0) {
      return Math.round(totalPrice / nights);
    }

    const todayKey = format(new Date(), "yyyy-MM-dd");
    return priceMap[todayKey] ?? listing.price;
  }, [dateRange, totalPrice, listing.price, priceMap]);

  const category = useMemo(
    () => categories.find((item) => item.label === listing.category),
    [listing.category]
  );

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <ListingInfo
            user={listing.user}
            category={category}
            description={listing.description}
            roomCount={listing.roomCount}
            guestCount={listing.guestCount}
            bathroomCount={listing.bathroomCount}
            locationValue={listing.locationValue}
          />
          <div className="order-first mb-10 md:order-last md:col-span-3">
            <ListingReservation
              price={displayPrice}
              totalPrice={totalPrice}
              onChangeDate={(value) => setDateRange(value)}
              dateRange={dateRange}
              onSubmit={onCreateReservation}
              disabled={isLoading}
              disabledDates={disabledDates}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
