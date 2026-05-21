import { NextResponse } from "next/server";
import { calculateDistanceMiles } from "@/src/lib/distance";
import { NBA_TEAM_SEARCH_TERMS } from "@/src/lib/nbaTeams";
import type { NearbyNBAGame } from "@/src/lib/ticketmaster";

const TICKETMASTER_EVENTS_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const DEFAULT_RADIUS_MILES = 150;

type NearbyGamesRequestBody = {
  latitude?: number;
  longitude?: number;
  radius?: number;
};

type TicketmasterImage = {
  url?: string;
  width?: number;
  height?: number;
};

type TicketmasterVenue = {
  name?: string;
  city?: { name?: string };
  state?: { name?: string; stateCode?: string };
  country?: { name?: string; countryCode?: string };
  location?: { latitude?: string; longitude?: string };
};

type TicketmasterAttraction = {
  name?: string;
};

type TicketmasterEvent = {
  id?: string;
  name?: string;
  info?: string;
  pleaseNote?: string;
  url?: string;
  distance?: number | string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
  };
  images?: TicketmasterImage[];
  _embedded?: {
    venues?: TicketmasterVenue[];
    attractions?: TicketmasterAttraction[];
  };
};

type TicketmasterResponse = {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
};

function parseNumber(value: number | string | undefined | null) {
  if (value == null) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickBestImage(images?: TicketmasterImage[]) {
  if (!images?.length) {
    return null;
  }

  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? null;
}

function normalizeText(value: string) {
  return value.toLowerCase();
}

function isNBAEvent(event: TicketmasterEvent) {
  const venue = event._embedded?.venues?.[0];
  const searchableText = [
    event.name,
    event.info,
    event.pleaseNote,
    venue?.name,
    venue?.city?.name,
    ...(event._embedded?.attractions?.map((attraction) => attraction.name) ??
      []),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeText)
    .join(" ");

  return NBA_TEAM_SEARCH_TERMS.some((term) =>
    searchableText.includes(normalizeText(term))
  );
}

function normalizeGame(
  event: TicketmasterEvent,
  userLatitude: number,
  userLongitude: number
): NearbyNBAGame {
  const venue = event._embedded?.venues?.[0];
  const venueLatitude = parseNumber(venue?.location?.latitude);
  const venueLongitude = parseNumber(venue?.location?.longitude);
  const ticketmasterDistance = parseNumber(event.distance);
  const calculatedDistance =
    venueLatitude != null && venueLongitude != null
      ? calculateDistanceMiles(
          userLatitude,
          userLongitude,
          venueLatitude,
          venueLongitude
        )
      : null;

  return {
    id:
      event.id ??
      `${event.name ?? "event"}-${event.dates?.start?.localDate ?? "unknown"}`,
    name: event.name ?? "Unnamed NBA event",
    date: event.dates?.start?.localDate ?? null,
    time: event.dates?.start?.localTime ?? null,
    venue: venue?.name ?? null,
    city: venue?.city?.name ?? null,
    state: venue?.state?.stateCode ?? venue?.state?.name ?? null,
    country: venue?.country?.countryCode ?? venue?.country?.name ?? null,
    latitude: venueLatitude,
    longitude: venueLongitude,
    distanceMiles: ticketmasterDistance ?? calculatedDistance,
    ticketUrl: event.url ?? null,
    image: pickBestImage(event.images),
  };
}

function sortGames(games: NearbyNBAGame[]) {
  return [...games].sort((a, b) => {
    if (a.distanceMiles != null && b.distanceMiles != null) {
      if (a.distanceMiles !== b.distanceMiles) {
        return a.distanceMiles - b.distanceMiles;
      }
    } else if (a.distanceMiles != null) {
      return -1;
    } else if (b.distanceMiles != null) {
      return 1;
    }

    const aTime = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;

    return aTime - bTime;
  });
}

async function fetchTicketmasterEvents({
  apiKey,
  latitude,
  longitude,
  radius,
  keyword,
}: {
  apiKey: string;
  latitude: number;
  longitude: number;
  radius: number;
  keyword?: string | null;
}) {
  const searchParams = new URLSearchParams({
    apikey: apiKey,
    latlong: `${latitude},${longitude}`,
    radius: String(radius),
    unit: "miles",
    classificationName: "Basketball",
    sort: "distance,asc",
    size: "10",
  });

  if (keyword?.trim()) {
    searchParams.set("keyword", keyword.trim());
  }

  const response = await fetch(
    `${TICKETMASTER_EVENTS_URL}?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ticketmaster request failed (${response.status}): ${
        text || "Unknown error"
      }`
    );
  }

  const payload = (await response.json()) as TicketmasterResponse;
  return payload._embedded?.events ?? [];
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "TICKETMASTER_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as NearbyGamesRequestBody;
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const requestedRadius = Number(body.radius);
    const radius = Number.isFinite(requestedRadius)
      ? requestedRadius
      : DEFAULT_RADIUS_MILES;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { error: "latitude and longitude are required." },
        { status: 400 }
      );
    }

    const primaryEvents = await fetchTicketmasterEvents({
      apiKey,
      latitude,
      longitude,
      radius,
      keyword: "NBA",
    });
    const primaryGames = sortGames(
      primaryEvents.map((event) => normalizeGame(event, latitude, longitude))
    );

    if (primaryGames.length > 0) {
      return NextResponse.json({
        games: primaryGames,
        source: "ticketmaster_nba_keyword",
        fallbackUsed: false,
      });
    }

    const fallbackEvents = await fetchTicketmasterEvents({
      apiKey,
      latitude,
      longitude,
      radius,
      keyword: null,
    });
    const fallbackGames = sortGames(
      fallbackEvents
        .filter(isNBAEvent)
        .map((event) => normalizeGame(event, latitude, longitude))
    );

    return NextResponse.json({
      games: fallbackGames,
      source: "ticketmaster_basketball_filtered",
      fallbackUsed: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not load nearby NBA games from Ticketmaster.";

    if (message.startsWith("Ticketmaster request failed")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
