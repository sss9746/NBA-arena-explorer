import type { Arena } from "@/data";
import { calculateDistanceMiles } from "./distance";
import type { NearbyRestaurant } from "@/src/lib/restaurants";
import type { NearbyNBAGame } from "@/src/lib/ticketmaster";
import type {
  Coordinates,
  RoadTripStartLocation,
} from "@/src/lib/locationResolver";

export type RoadTripTravel = {
  distanceMiles: number;
  driveTimeHours: number;
  distanceText: string;
  durationText: string;
};

export type RoadTripStop = {
  day: number;
  city: string;
  state: string;
  arenaName: string;
  teamName: string;
  gameTitle: string | null;
  gameDate: string | null;
  ticketUrl: string | null;
  restaurantName: string;
  restaurantAddress: string | null;
  restaurantMapsUrl: string | null;
  coordinates: Coordinates;
  travelFromPrevious: RoadTripTravel;
  notes: string;
};

export type RoadTripMode =
  | "multi_game_trip"
  | "single_game_plan"
  | "no_games_found";

export type RoadTripItinerary = {
  type: "road_trip";
  mode: RoadTripMode;
  title: string;
  tripStartDate: string;
  tripEndDate: string;
  summary: string;
  message: string;
  startLocation: RoadTripStartLocation;
  stops: RoadTripStop[];
  routeCoordinates: Coordinates[];
  totalDistanceMiles: number | null;
  totalDistanceText: string;
  totalDriveTimeHours: number | null;
  totalDriveTimeText: string;
  warnings: string[];
};

type RestaurantLoader = (location: {
  latitude: number;
  longitude: number;
}) => Promise<NearbyRestaurant[]>;

type RoadTripPlannerInput = {
  startLocation: RoadTripStartLocation;
  tripLengthDays?: number;
  games?: NearbyNBAGame[];
  arenas: Arena[];
  loadRestaurants?: RestaurantLoader;
  warnings?: string[];
  tripStartDate?: Date;
};

type PlannedArena = {
  arena: Arena;
  game: NearbyNBAGame;
};

function normalizeText(value?: string | null) {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}

function includesNormalized(source?: string | null, value?: string | null) {
  const normalizedSource = normalizeText(source);
  const normalizedValue = normalizeText(value);
  return Boolean(normalizedSource && normalizedValue && normalizedSource.includes(normalizedValue));
}

export function matchGameToArena(game: NearbyNBAGame, arenas: Arena[]) {
  let bestMatch: { arena: Arena; score: number } | null = null;

  for (const arena of arenas) {
    let score = 0;

    if (
      includesNormalized(game.venue, arena.arenaName) ||
      includesNormalized(arena.arenaName, game.venue)
    ) {
      score += 8;
    }

    if (includesNormalized(game.name, arena.teamName)) {
      score += 6;
    }

    if (normalizeText(game.city) === normalizeText(arena.city)) {
      score += 3;
    }

    if (
      game.latitude != null &&
      game.longitude != null &&
      calculateDistanceMiles(
        game.latitude,
        game.longitude,
        arena.latitude,
        arena.longitude
      ) < 3
    ) {
      score += 4;
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { arena, score };
    }
  }

  return bestMatch?.arena ?? null;
}

export function normalizeGameDate(game: NearbyNBAGame) {
  if (!game.date) {
    return null;
  }

  const parsed = new Date(`${game.date}T${game.time ?? "00:00:00"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getTripDateWindow(
  tripStartDate = new Date(),
  tripLengthDays = 3
) {
  const start = new Date(tripStartDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + tripLengthDays);

  return {
    tripStartDate: start,
    tripEndDate: end,
  };
}

export function isGameWithinTripWindow(
  game: NearbyNBAGame,
  tripStartDate: Date,
  tripEndDate: Date
) {
  const gameDate = normalizeGameDate(game);
  return Boolean(
    gameDate && gameDate >= tripStartDate && gameDate < tripEndDate
  );
}

export function filterGamesByTripWindow(
  games: NearbyNBAGame[],
  tripStartDate: Date,
  tripEndDate: Date
) {
  return games.filter((game) =>
    isGameWithinTripWindow(game, tripStartDate, tripEndDate)
  );
}

function getDistance(origin: Coordinates, arena: Arena) {
  return calculateDistanceMiles(
    origin.lat,
    origin.lng,
    arena.latitude,
    arena.longitude
  );
}

function formatDistance(distanceMiles: number) {
  const roundedDistance = Math.round(distanceMiles);
  return `About ${roundedDistance} ${roundedDistance === 1 ? "mile" : "miles"}`;
}

function formatDriveDuration(distanceMiles: number) {
  const totalMinutes = Math.max(5, Math.round((distanceMiles / 60) * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) {
    return `About ${minutes} min`;
  }

  return `About ${hours} hr${minutes ? ` ${minutes} min` : ""}`;
}

function getTravel(origin: Coordinates, destination: Coordinates) {
  const distanceMiles = calculateDistanceMiles(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  );

  return {
    distanceMiles,
    driveTimeHours: distanceMiles / 60,
    distanceText: formatDistance(distanceMiles),
    durationText: formatDriveDuration(distanceMiles),
  };
}

export function getRoadTripTotals(stops: RoadTripStop[]) {
  if (!stops.length) {
    return {
      totalDistanceMiles: null,
      totalDistanceText: "Distance unavailable",
      totalDriveTimeHours: null,
      totalDriveTimeText: "Drive time unavailable",
    };
  }

  const totalDistanceMiles = stops.reduce(
    (sum, stop) => sum + stop.travelFromPrevious.distanceMiles,
    0
  );
  const totalDriveTimeHours = stops.reduce(
    (sum, stop) => sum + stop.travelFromPrevious.driveTimeHours,
    0
  );

  return {
    totalDistanceMiles,
    totalDistanceText: formatDistance(totalDistanceMiles),
    totalDriveTimeHours,
    totalDriveTimeText: formatDriveDuration(totalDistanceMiles),
  };
}

function chooseStops({
  startLocation,
  tripLengthDays,
  games,
  arenas,
}: Required<Pick<RoadTripPlannerInput, "startLocation" | "tripLengthDays" | "games" | "arenas">>) {
  const chosen: PlannedArena[] = [];
  const chosenArenaIds = new Set<string>();
  const chosenGameIds = new Set<string>();
  const matchedGames = games
    .map((game) => ({ game, arena: matchGameToArena(game, arenas) }))
    .filter(
      (candidate): candidate is { game: NearbyNBAGame; arena: Arena } =>
        Boolean(candidate.arena)
    )
    .sort((a, b) => {
      return getDistance(startLocation.coordinates, a.arena) -
        getDistance(startLocation.coordinates, b.arena);
    });
  const maxStops = Math.min(tripLengthDays, matchedGames.length);

  for (const candidate of matchedGames) {
    if (chosen.length >= maxStops || chosenArenaIds.has(candidate.arena.id)) {
      continue;
    }

    chosen.push(candidate);
    chosenArenaIds.add(candidate.arena.id);
    chosenGameIds.add(candidate.game.id);
  }

  for (const candidate of matchedGames) {
    if (chosen.length >= maxStops || chosenGameIds.has(candidate.game.id)) {
      continue;
    }

    chosen.push(candidate);
    chosenGameIds.add(candidate.game.id);
  }

  chosen.sort((a, b) => {
    const aTime = normalizeGameDate(a.game)?.getTime() ?? Number.POSITIVE_INFINITY;
    const bTime = normalizeGameDate(b.game)?.getTime() ?? Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });

  return chosen;
}

async function loadRestaurantForArena(
  arena: Arena,
  loadRestaurants?: RestaurantLoader
) {
  if (!loadRestaurants) {
    return null;
  }

  try {
    const restaurants = await loadRestaurants({
      latitude: arena.latitude,
      longitude: arena.longitude,
    });
    return restaurants[0] ?? null;
  } catch {
    return null;
  }
}

function getGameDate(game: NearbyNBAGame) {
  if (!game.date) {
    return null;
  }

  return `${game.date}${game.time ? `T${game.time}` : ""}`;
}

function buildNotes(restaurant: NearbyRestaurant | null) {
  if (restaurant) {
    return "Start with a meal near the arena, then head to the live Ticketmaster game.";
  }

  return "Explore the arena district before the live Ticketmaster game.";
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function buildNoGamesFoundPlan({
  startLocation,
  tripStartDate,
  tripEndDate,
  warnings = [],
}: {
  startLocation: RoadTripStartLocation;
  tripStartDate: Date;
  tripEndDate: Date;
  warnings?: string[];
}): RoadTripItinerary {
  const summary = "No NBA games were found within your 3-day window.";

  return {
    type: "road_trip",
    mode: "no_games_found",
    title: "No NBA Games Found",
    tripStartDate: toDateOnly(tripStartDate),
    tripEndDate: toDateOnly(tripEndDate),
    summary,
    message:
      "I could not find any NBA games within your 3-day window. Try a different starting city or date range.",
    startLocation,
    stops: [],
    routeCoordinates: [],
    totalDistanceMiles: null,
    totalDistanceText: "Distance unavailable",
    totalDriveTimeHours: null,
    totalDriveTimeText: "Drive time unavailable",
    warnings: [
      ...warnings,
      "No NBA games were found within the selected 3-day window.",
    ],
  };
}

export async function generateRoadTripItinerary({
  startLocation,
  tripLengthDays = 3,
  games = [],
  arenas,
  loadRestaurants,
  warnings: initialWarnings = [],
  tripStartDate: requestedTripStartDate,
}: RoadTripPlannerInput): Promise<RoadTripItinerary> {
  const { tripStartDate, tripEndDate } = getTripDateWindow(
    requestedTripStartDate,
    tripLengthDays
  );
  const gamesWithinTripWindow = filterGamesByTripWindow(
    games,
    tripStartDate,
    tripEndDate
  );
  const plannedArenas = chooseStops({
    startLocation,
    tripLengthDays,
    games: gamesWithinTripWindow,
    arenas,
  });
  const warnings = [...initialWarnings];

  if (!plannedArenas.length) {
    return buildNoGamesFoundPlan({
      startLocation,
      tripStartDate,
      tripEndDate,
      warnings,
    });
  }

  const restaurants = await Promise.all(
    plannedArenas.map(({ arena }) =>
      loadRestaurantForArena(arena, loadRestaurants)
    )
  );
  const liveGameCount = plannedArenas.length;
  const mode: RoadTripMode =
    liveGameCount === 1 ? "single_game_plan" : "multi_game_trip";

  if (mode === "single_game_plan") {
    warnings.push(
      "Only one NBA game was found within your 3-day window."
    );
  }

  if (restaurants.some((restaurant) => !restaurant)) {
    warnings.push("Some stops do not have a restaurant result yet.");
  }

  warnings.push("Route is estimated using direct map connections.");

  let previousCoordinates = startLocation.coordinates;
  const stops = plannedArenas.map(({ arena, game }, index) => {
    const restaurant = restaurants[index];
    const coordinates = { lat: arena.latitude, lng: arena.longitude };
    const stop: RoadTripStop = {
      day: index + 1,
      city: arena.city,
      state: arena.state,
      arenaName: arena.arenaName,
      teamName: arena.teamName,
      gameTitle: game.name,
      gameDate: getGameDate(game),
      ticketUrl: game.ticketUrl,
      restaurantName: restaurant?.name ?? "No restaurant found yet",
      restaurantAddress: restaurant?.address ?? null,
      restaurantMapsUrl: restaurant?.googleMapsUrl ?? null,
      coordinates,
      travelFromPrevious: getTravel(previousCoordinates, coordinates),
      notes: buildNotes(restaurant),
    };

    previousCoordinates = coordinates;
    return stop;
  });
  const title =
    mode === "single_game_plan" ? "NBA Game Plan" : `${tripLengthDays}-Day NBA Road Trip`;
  const summary =
    mode === "single_game_plan"
      ? "Only one NBA game was found within your 3-day window, so I planned around that game."
      : `I found ${liveGameCount} NBA games within your ${tripLengthDays}-day window starting from ${startLocation.label}.`;
  const totals = getRoadTripTotals(stops);
  const message =
    mode === "single_game_plan"
      ? "I only found one NBA game within your 3-day window, so I planned a focused game-day trip instead of forcing unrelated games."
      : "I found multiple NBA games within your 3-day window, so I built a road trip around those matchups.";

  return {
    type: "road_trip",
    mode,
    title,
    tripStartDate: toDateOnly(tripStartDate),
    tripEndDate: toDateOnly(tripEndDate),
    summary,
    message: `${message} I added the itinerary to the map so you can review the route and each day in the side panel.`,
    startLocation,
    stops,
    routeCoordinates: [
      startLocation.coordinates,
      ...stops.map((stop) => stop.coordinates),
    ],
    ...totals,
    warnings,
  };
}
