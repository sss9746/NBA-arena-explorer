type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type NearbyGamesSource =
  | "ticketmaster_nba_keyword"
  | "ticketmaster_basketball_filtered";

export type NearbyNBAGame = {
  id: string;
  name: string;
  date: string | null;
  time: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceMiles: number | null;
  ticketUrl: string | null;
  image: string | null;
};

type NearbyGamesResponse = {
  games?: NearbyNBAGame[];
  source?: NearbyGamesSource;
  fallbackUsed?: boolean;
  error?: string;
};

export type NearbyGamesResult = {
  games: NearbyNBAGame[];
  source: NearbyGamesSource | null;
  fallbackUsed: boolean;
};

export async function fetchNearbyNBAGames(
  userLocation: UserLocation,
  radius = 150
) {
  const response = await fetch("/api/ticketmaster/nearby-games", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius,
    }),
  });

  const data = (await response.json()) as NearbyGamesResponse;

  if (!response.ok) {
    throw new Error(data.error || "Could not load live nearby NBA games.");
  }

  return {
    games: data.games ?? [],
    source: data.source ?? null,
    fallbackUsed: data.fallbackUsed ?? false,
  };
}
