"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";

export interface LocationValue {
  lat: number;
  lng: number;
  address: string;
}

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  selectable?: boolean;
  onChange?: (value: LocationValue) => void;
  markerPosition?: {
    lat: number;
    lng: number;
  } | null;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784,
};



const Map: React.FC<MapProps> = ({
  center,
  selectable = false,
  onChange,
  markerPosition = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mapCenter, setMapCenter] = useState(center ?? defaultCenter);
  const [markerPos, setMarkerPos] = useState(markerPosition ?? center ?? defaultCenter);

  const reverseGeocodeClient = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=tr`
      );
      const json = await res.json();
      return json.results?.[0]?.formatted_address ?? "Adres bulunamadı";
    },
    []
  );

  useEffect(() => {
    const latStr = searchParams!.get("lat");
    const lngStr = searchParams!.get("lng");

    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      const location = { lat, lng };
      setMapCenter(location);
      setMarkerPos(location);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams!.get("lat")) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const address = await reverseGeocodeClient(coords.lat, coords.lng);

          setMapCenter(coords);
          setMarkerPos(coords);

          onChange?.({ ...coords, address });

          router.replace(`?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        },
        () => {
          // Konum alınamazsa sessizce geç
        }
      );
    }
  }, [onChange, reverseGeocodeClient, router, searchParams]);

  useEffect(() => {
    if (center) {
      setMapCenter(center);
      setMarkerPos(center);
      router.replace(`?lat=${center.lat}&lng=${center.lng}`, { scroll: false });
    }
  }, [center, router]);

  const handleDblClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!selectable || !e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const address = await reverseGeocodeClient(lat, lng);
      const selectedLocation = { lat, lng };

      setMapCenter(selectedLocation);
      setMarkerPos(selectedLocation);

      onChange?.({ ...selectedLocation, address });

      router.replace(`?lat=${lat}&lng=${lng}`, { scroll: false });
    },
    [selectable, reverseGeocodeClient, onChange, router]
  );

  return (
   <GoogleMap
        key={`${mapCenter.lat}-${mapCenter.lng}`}
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        onDblClick={handleDblClick}
        options={{
          styles: [
            {
              featureType: "poi",
              elementType: "all",
              stylers: [{ visibility: "off" }],
            },
          ],
          disableDefaultUI: false,
          clickableIcons: false,
        }}
      >
        <Marker position={markerPos} />
      </GoogleMap>
    
  );
};

export default Map;
