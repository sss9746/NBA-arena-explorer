import { teams } from "@/data";

const TICKETMASTER_BASE_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_RADIUS_MILES = 100;
const DEFAULT_PAGE_SIZE = 12;

type TicketmasterImage = {
  url?: string;
  width?: number;
  height?: number;
};

type TicketmasterPriceRange = {
  min?: number;
  max?: number;
  currency?: string;
};

type TicketmasterAttraction = {
  name?: string;
};

type TicketmasterVenue = {
  name?: string;
  city?: { name?: string };
  state?: { name?: string; stateCode?: string };
  country?: { name?: string; countryCode?: string };
  location?: { latitude?: string; longitude?: string };
};

type TicketmasterRawEvent = {
  id?: string;
  name?: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
      dateTime?: string;
      timezone?: string;
    };
    timezone?: string;
    status?: {
      code?: string;
    };
  };
  images?: TicketmasterImage[];
  priceRanges?: TicketmasterPriceRange[];
  _embedded?: {
    venues?: TicketmasterVenue[];
    attractions?: TicketmasterAttraction[];
  };
};

type TicketmasterSearchResponse = {
  _embedded?: {
    events?: TicketmasterRawEvent[];
  };
};

export type NbaTicketmasterEvent = {
  id: string;
  name: string;
  date: string | null;
  time: string | null;
  dateTime: string | null;
  timezone: string | null;
  venueName: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  ticketUrl: string | null;
  imageUrl: string | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null;
  teamsOrAttractions: string[];
};

type CacheEntry = {
  expiresAt: number;
  data: NbaTicketmasterEvent[];
};

const requestCache = new Map<string, CacheEntry>();
const nbaTeamNames = teams.map((team) => team.name.toLowerCase());

function getApiKey() {
  const apiKey = process.env.TICKETMASTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("TICKETMASTER_API_KEY is not configured.");
  }

  return apiKey;
}

function parseNumber(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickBestImage(images?: TicketmasterImage[]) {
  if (!images?.length) {
    return null;
  }

  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? null;
}

function isLikelyNbaEvent(event: TicketmasterRawEvent) {
  const name = event.name?.toLowerCase() ?? "";
  const attractions =
    event._embedded?.attractions?.map((item) => item.name?.toLowerCase() ?? "") ??
    [];

  return nbaTeamNames.some(
    (teamName) =>
      name.includes(teamName) ||
      attractions.some((attraction) => attraction.includes(teamName))
  );
}

function isUpcomingEvent(event: TicketmasterRawEvent) {
  const eventDateTime = event.dates?.start?.dateTime;

  if (eventDateTime) {
    const parsed = new Date(eventDateTime);
    return !Number.isNaN(parsed.getTime()) && parsed.getTime() >= Date.now();
  }

  const localDate = event.dates?.start?.localDate;

  if (!localDate) {
    return true;
  }

  const fallbackDate = new Date(`${localDate}T23:59:59`);
  return !Number.isNaN(fallbackDate.getTime()) && fallbackDate.getTime() >= Date.now();
}

function isActiveEvent(event: TicketmasterRawEvent) {
  const statusCode = event.dates?.status?.code?.toLowerCase();

  if (!statusCode) {
    return true;
  }

  return !["cancelled", "canceled", "postponed"].includes(statusCode);
}

async function fetchTicketmasterEvents(
  cacheKey: string,
  params: Record<string, string>
) {
  const cached = requestCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const apiKey = getApiKey();
  const searchParams = new URLSearchParams({
    apikey: apiKey,
    size: String(DEFAULT_PAGE_SIZE),
    sort: "date,asc",
    segmentName: "Sports",
    genreName: "Basketball",
    ...params,
  });

  const response = await fetch(`${TICKETMASTER_BASE_URL}?${searchParams}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ticketmaster request failed (${response.status}): ${text || "Unknown error"}`
    );
  }

  const payload = (await response.json()) as TicketmasterSearchResponse;
  const normalized = (payload._embedded?.events ?? [])
    .filter(isLikelyNbaEvent)
    .filter(isActiveEvent)
    .filter(isUpcomingEvent)
    .map(normalizeTicketmasterEvent);

  requestCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data: normalized,
  });

  return normalized;
}

export function normalizeTicketmasterEvent(
  event: TicketmasterRawEvent
): NbaTicketmasterEvent {
  const venue = event._embedded?.venues?.[0];
  const priceRange = event.priceRanges?.[0];
  const teamsOrAttractions =
    event._embedded?.attractions
      ?.map((item) => item.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  return {
    id: event.id ?? `${event.name ?? "event"}-${event.dates?.start?.localDate ?? "unknown"}`,
    name: event.name ?? "Unnamed event",
    date: event.dates?.start?.localDate ?? null,
    time: event.dates?.start?.localTime ?? null,
    dateTime: event.dates?.start?.dateTime ?? null,
    timezone:
      event.dates?.start?.timezone ?? event.dates?.timezone ?? null,
    venueName: venue?.name ?? null,
    city: venue?.city?.name ?? null,
    state: venue?.state?.stateCode ?? venue?.state?.name ?? null,
    country: venue?.country?.countryCode ?? venue?.country?.name ?? null,
    latitude: parseNumber(venue?.location?.latitude),
    longitude: parseNumber(venue?.location?.longitude),
    ticketUrl: event.url ?? null,
    imageUrl: pickBestImage(event.images),
    priceMin: priceRange?.min ?? null,
    priceMax: priceRange?.max ?? null,
    currency: priceRange?.currency ?? null,
    teamsOrAttractions,
  };
}

export async function searchNbaEventsByTeam(teamName: string) {
  return fetchTicketmasterEvents(`team:${teamName.toLowerCase()}`, {
    keyword: teamName,
  });
}

export async function searchNbaEventsNearLocation(
  lat: number,
  lng: number,
  radiusMiles = DEFAULT_RADIUS_MILES
) {
  return fetchTicketmasterEvents(`nearby:${lat}:${lng}:${radiusMiles}`, {
    latlong: `${lat},${lng}`,
    radius: String(radiusMiles),
    unit: "miles",
  });
}

export async function searchNbaEventsByVenue(venueName: string) {
  return fetchTicketmasterEvents(`venue:${venueName.toLowerCase()}`, {
    venueName,
  });
}
