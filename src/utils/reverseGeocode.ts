export interface ReverseGeocodeResult {
  displayName: string;
  components: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
}

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<ReverseGeocodeResult | null> => {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.NEXT_PUBLIC_OPENCAGE_KEY}&language=tr`
    );
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return {
        displayName: data.results[0].formatted, // 👈 burada `displayName` set ediliyor
        components: data.results[0].components,
      };
    }
  } catch (error) {
    console.error("⛔ OpenCage reverse geocode hatası:", error);
  }
  return null;
};
