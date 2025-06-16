// app/actions/geocode.ts
export interface GoogleGeocodeResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

// Server‑side reverse geocode: Next.js Route veya getServerSideProps içinde import edin.
export async function reverseGeocodeServer(lat: number, lng: number) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}&language=tr`
  );
  if (!res.ok) throw new Error("Geocode failed");
  const data = await res.json();
  return data.results?.[0] as GoogleGeocodeResult;
}
