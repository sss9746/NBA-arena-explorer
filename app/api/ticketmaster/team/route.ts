import { NextResponse } from "next/server";
import { searchNbaEventsByTeam } from "@/lib/ticketmaster";

export async function GET(req: Request) {
  try {
    if (!process.env.TICKETMASTER_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Live game data is not configured yet." },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const team = searchParams.get("team")?.trim();

    if (!team) {
      return NextResponse.json(
        { error: "Team query is required." },
        { status: 400 }
      );
    }

    const events = await searchNbaEventsByTeam(team);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { error: "Could not load live Ticketmaster games right now." },
      { status: 500 }
    );
  }
}
