// app/actions/reverse-geocode.ts

export interface ReverseGeocodeResult {
  formatted: string;
  components: Record<string, any>;
}

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<ReverseGeocodeResult | null> => {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.NEXT_PUBLIC_OPENCAGE_KEY}&language=tr`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("OpenCage lookup failed");
    const data = await res.json();
    const first = data.results?.[0];
    if (!first) return null;
    return {
      formatted: first.formatted,
      components: first.components,
    };
  } catch (err) {
    console.error("⛔ OpenCage reverse geocode hatası:", err);
    return null;
  }
};
