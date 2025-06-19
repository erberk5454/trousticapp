"use client";

import { LoadScript } from "@react-google-maps/api";

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      mapIds={["8d9a44504e350b197eb2ef5d"]}
    >
      {children}
    </LoadScript>
  );
};

export default MapProvider;
