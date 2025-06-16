// app/api/reverse-geocode/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { lat, lon } = await req.json();

  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=tr`,
      {
        headers: {
          "User-Agent": "rentmap-app/1.0 (https://yourdomain.com)",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    const result = data?.results?.[0];
    return NextResponse.json(result || null);
  } catch (error) {
    return NextResponse.json({ error: "Reverse geocoding failed." }, { status: 500 });
  }
}
