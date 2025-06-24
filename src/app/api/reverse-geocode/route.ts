// app/api/reverse-geocode/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lat, lng } = body;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key eksik." }, { status: 500 });
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json({ error: "Geocode başarısız." }, { status: 400 });
    }

    const addressComponents = data.results[0]?.address_components || [];

    const getComponent = (type: string) =>
      addressComponents.find((comp: any) => comp.types.includes(type))?.long_name;

    const city = getComponent("administrative_area_level_1") || "Bilinmiyor";
    const district = getComponent("administrative_area_level_2") || "Bilinmiyor";

    return NextResponse.json({ city, district });
  } catch (error) {
    console.error("Reverse geocode hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
