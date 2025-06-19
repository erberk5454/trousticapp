"use client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import Button from "../Button";
import HeartButton from "../HeartButton";
import { tr } from "date-fns/locale";

type ListingCardProps = {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    const today = new Date();
    const todayKey = format(today, "yyyy-MM-dd");

    const priceMap: Record<string, number> = {};

    (data.prices || []).forEach(
      (priceObj: { startDate: string; endDate: string; price: number }) => {
        const start = new Date(priceObj.startDate);
        const end = new Date(priceObj.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = format(d, "yyyy-MM-dd");
          priceMap[key] = priceObj.price;
        }
      }
    );

    return priceMap[todayKey] ?? data.price;
  }, [reservation, data]);

const reservationDate = useMemo(() => {
  if (!reservation) return null;
  
  const start = new Date(reservation.startDate);
  const end = new Date(reservation.endDate);
  return `${format(start, "PP", { locale: tr })} - ${format(end, "PP", { locale: tr })}`;
}, [reservation]);
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="Listing"
            src={data.imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition"
            sizes="(max-width: 640px) 100vw, 
       (max-width: 768px) 50vw, 
       (max-width: 1024px) 33vw, 
       (max-width: 1280px) 25vw, 
       (max-width: 1536px) 20vw, 
       16.6vw"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">{price.toLocaleString("tr-TR")} TL</div>
          {!reservation && <div className="font-light"> /gece</div>}
        </div>
        {onAction && actionLabel && (
          <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
