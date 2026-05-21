import { NextResponse } from "next/server";
import { searchNbaEventsNearLocation } from "@/lib/ticketmaster";

export async function GET(req: Request) {
  try {
    if (!process.env.TICKETMASTER_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Live game data is not configured yet." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lat = Number.parseFloat(searchParams.get("lat") ?? "");
    const lng = Number.parseFloat(searchParams.get("lng") ?? "");
    const radius = Number.parseInt(searchParams.get("radius") ?? "100", 10);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { error: "lat and lng are required." },
        { status: 400 }
      );
    }

    const events = await searchNbaEventsNearLocation(
      lat,
      lng,
      Number.isFinite(radius) ? radius : 100
    );

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { error: "Could not load live Ticketmaster games right now." },
      { status: 500 }
    );
  }
}
