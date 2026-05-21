import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Use /api/ticketmaster/team?team=... or /api/ticketmaster/nearby?lat=...&lng=...",
  });
}
