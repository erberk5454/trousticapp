"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  GoogleMapProps,
} from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";

export interface LocationValue {
  lat: number;
  lng: number;
  address: string;
}

interface MapProps {
  center?: { lat: number; lng: number };
  selectable?: boolean;
  onChange?: (loc: LocationValue) => void;
  markerPosition?: { lat: number; lng: number } | null;
}

const containerStyle: GoogleMapProps["mapContainerStyle"] = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 41.0082, lng: 28.9784 };

const Map: React.FC<MapProps> = ({
  center,
  selectable = false,
  onChange,
  markerPosition = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    center ?? defaultCenter
  );
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>(
    markerPosition ?? center ?? defaultCenter
  );

  const reverseGeocodeClient = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=tr`
        );
        const json = await res.json();

        if (json.status !== "OK" || !json.results || json.results.length === 0) {
          console.warn("Geocode başarısız:", json);
          return "Adres bulunamadı";
        }

        return json.results[0].formatted_address;
      } catch (error) {
        console.error("Geocode hatası:", error);
        return "Adres alınamadı";
      }
    },
    []
  );

  useEffect(() => {
    if (!searchParams) return;

    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    if (latStr && lngStr) {
      const lt = parseFloat(latStr);
      const ln = parseFloat(lngStr);
      setMapCenter({ lat: lt, lng: ln });
      setMarkerPos({ lat: lt, lng: ln });
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("lat")) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const address = await reverseGeocodeClient(coords.lat, coords.lng);
          setMapCenter(coords);
          setMarkerPos(coords);
          onChange?.({ ...coords, address });
          router.replace(`?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        },
        () => {
          console.warn("Kullanıcı konum izni vermedi.");
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
    setMapCenter({ lat, lng });
    setMarkerPos({ lat, lng });
    onChange?.({ lat, lng, address });
    router.replace(`?lat=${lat}&lng=${lng}`, { scroll: false });
  },
  [onChange, reverseGeocodeClient, router, selectable]
);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={13}
        onDblClick={handleDblClick}
      >
        <Marker position={markerPos} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
