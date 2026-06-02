import { NextResponse } from "next/server";
import { arenas, teams, games, restaurants } from "@/data";
import {
  type NbaTicketmasterEvent,
  searchNbaEventsByTeam,
  searchNbaEventsByVenue,
  searchNbaEventsNearLocation,
} from "@/lib/ticketmaster";
import type { NearbyNBAGame } from "@/src/lib/ticketmaster";
import type { NearbyGamesSource } from "@/src/lib/ticketmaster";
import type { NearbyRestaurant } from "@/src/lib/restaurants";
import type { RoadTripItinerary } from "@/src/lib/roadTripPlanner";

type SilverRequestBody = {
  message?: string;
  selectedTeamName?: string | null;
  selectedArenaName?: string | null;
  userLocation?: {
    lat?: number;
    lng?: number;
  } | null;
  context?: {
    userLocation?: {
      latitude?: number;
      longitude?: number;
      accuracy?: number | null;
    } | null;
    nearbyGames?: NearbyNBAGame[];
    nearbyGamesSource?: NearbyGamesSource | null;
    fallbackUsed?: boolean;
    nearbyGamesError?: string | null;
    selectedArena?: {
      arenaName?: string;
      city?: string;
      state?: string;
      latitude?: number;
      longitude?: number;
    } | null;
    selectedGame?: NearbyNBAGame | null;
    nearbyRestaurants?: NearbyRestaurant[];
    nearbyRestaurantsError?: string | null;
    activeRoadTrip?: RoadTripItinerary | null;
  } | null;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type OpenAIErrorPayload = {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

const LIVE_EVENT_INTENT_PATTERNS = [
  "ticket",
  "tickets",
  "game",
  "games",
  "near",
  "closest",
  "upcoming",
  "schedule",
  "road trip",
  "arena",
  "events",
];
const LOCATION_INTENT_REGEX = /\b(near me|nearby|closest|near)\b/i;

function buildArenaContext() {
  return arenas
    .map((arena) => {
      const team = teams.find((item) => item.id === arena.teamId);
      const arenaRestaurants = restaurants
        .filter((item) => item.arenaId === arena.id)
        .slice(0, 3);
      const arenaGames = games
        .filter((item) => item.arenaId === arena.id)
        .slice(0, 2);

      const restaurantSummary = arenaRestaurants.length
        ? arenaRestaurants
            .map(
              (item) =>
                `${item.name} (${item.cuisine}, ${item.distance}, ${item.price}, ${item.rating}/5)`
            )
            .join("; ")
        : "No restaurant data available.";

      const gameSummary = arenaGames.length
        ? arenaGames
            .map(
              (item) =>
                `${item.date} ${item.time} | ${item.matchup} | ${item.ticketUrl}`
            )
            .join("; ")
        : "No game data available.";

      return [
        `Arena ${arena.id}: ${arena.arenaName} | ${arena.city}, ${arena.state}, ${arena.country}`,
        `Team: ${arena.teamName}${team ? ` (${team.abbreviation})` : ""}${team ? ` | ${team.conference} | ${team.division}` : ""}`,
        `Venue details: capacity ${arena.capacity} | opened ${arena.opened} | address ${arena.address}`,
        `Links: tickets ${arena.ticketUrl} | website ${arena.websiteUrl}`,
        `Access: parking ${arena.parkingInfo} | transit ${arena.transitInfo}`,
        `Policies: bag ${arena.bagPolicy}`,
        team
          ? `Team profile: colors ${team.primaryColor}/${team.secondaryColor} | ${team.shortDescription}`
          : "Team profile: No team profile available.",
        `Restaurants: ${restaurantSummary}`,
        `Games: ${gameSummary}`,
        `Notes: ${arena.notes}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}

function buildTicketmasterContext(events: NbaTicketmasterEvent[]) {
  if (!events.length) {
    return "No matching Ticketmaster events were found.";
  }

  return events
    .slice(0, 8)
    .map((event, index) =>
      [
        `${index + 1}. ${event.name}`,
        `Date/time: ${[event.date, event.time].filter(Boolean).join(" | ") || "Not listed"}`,
        `Venue: ${event.venueName || "Unknown venue"}`,
        `Location: ${[event.city, event.state].filter(Boolean).join(", ") || "Unknown location"}`,
        `Price: ${
          event.priceMin != null && event.priceMax != null
            ? `${event.priceMin}-${event.priceMax} ${event.currency || ""}`.trim()
            : "Not listed"
        }`,
        `Tickets: ${event.ticketUrl || "No link available"}`,
        `Coordinates: ${
          event.latitude != null && event.longitude != null
            ? `${event.latitude}, ${event.longitude}`
            : "Not listed"
        }`,
      ].join("\n")
    )
    .join("\n\n");
}

function buildNearbyGamesContext(
  nearbyGames: NearbyNBAGame[],
  nearbyGamesSource?: NearbyGamesSource | null,
  fallbackUsed?: boolean,
  nearbyGamesError?: string | null
) {
  if (nearbyGamesError) {
    return `Live nearby games status: ${nearbyGamesError}`;
  }

  if (!nearbyGames.length) {
    return [
      "No live nearby NBA games were returned from Ticketmaster.",
      nearbyGamesSource ? `Source: ${nearbyGamesSource}` : null,
      `Fallback used: ${fallbackUsed ? "yes" : "no"}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const metadata = [
    `Source: ${nearbyGamesSource || "ticketmaster"}`,
    `Fallback used: ${fallbackUsed ? "yes" : "no"}`,
    fallbackUsed
      ? "Fallback note: These are nearby NBA-related games filtered from Ticketmaster basketball results."
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const gamesContext = nearbyGames
    .slice(0, 10)
    .map((game, index) =>
      [
        `${index + 1}. ${game.name}`,
        `Date/time: ${[game.date, game.time].filter(Boolean).join(" | ") || "Not listed"}`,
        `Venue: ${game.venue || "Unknown venue"}`,
        `Location: ${[game.city, game.state, game.country].filter(Boolean).join(", ") || "Unknown location"}`,
        `Distance from user: ${
          game.distanceMiles != null
            ? `${game.distanceMiles.toFixed(1)} miles`
            : "Not listed"
        }`,
        `Tickets: ${game.ticketUrl || "No link available"}`,
        `Coordinates: ${
          game.latitude != null && game.longitude != null
            ? `${game.latitude}, ${game.longitude}`
            : "Not listed"
        }`,
      ].join("\n")
    )
    .join("\n\n");

  return `${metadata}\n\n${gamesContext}`;
}

function buildNearbyRestaurantsContext(
  nearbyRestaurants: NearbyRestaurant[],
  nearbyRestaurantsError?: string | null
) {
  if (nearbyRestaurantsError) {
    return `Live restaurant status: ${nearbyRestaurantsError}`;
  }

  if (!nearbyRestaurants.length) {
    return "No nearby restaurants were returned from Google Places.";
  }

  return nearbyRestaurants
    .slice(0, 10)
    .map((restaurant, index) =>
      [
        `${index + 1}. ${restaurant.name}`,
        `Address: ${restaurant.address || "Not listed"}`,
        `Rating: ${
          restaurant.rating != null
            ? `${restaurant.rating}/5 (${restaurant.userRatingCount ?? 0} reviews)`
            : "Not listed"
        }`,
        `Price level: ${restaurant.priceLevel || "Not listed"}`,
        `Open now: ${
          restaurant.openNow == null ? "Unknown" : restaurant.openNow ? "Yes" : "No"
        }`,
        `Distance from arena/search point: ${
          restaurant.distanceMiles != null
            ? `${restaurant.distanceMiles.toFixed(1)} miles`
            : "Not listed"
        }`,
        `Google Maps: ${restaurant.googleMapsUrl || "No link available"}`,
        `Website: ${restaurant.websiteUrl || "No link available"}`,
      ].join("\n")
    )
    .join("\n\n");
}

function buildPrompt(
  message: string,
  liveTicketmasterContext?: string,
  appContext?: string,
  nearbyRestaurantsContext?: string
) {
  const context = buildArenaContext();

  return `
You are Silver AI, an NBA arena explorer assistant, road trip planner, arena guide, and game recommendation assistant.

Rules:
- Use only the provided NBA data when giving arena, game, restaurant, or ticket information.
- Do not invent live schedules, prices, or ticket availability.
- When nearbyGames are provided, use them as the source of truth for real upcoming games.
- If fallbackUsed is true, still treat returned events as live Ticketmaster data, but avoid overstating certainty. You may say, "I found these nearby NBA-related games from Ticketmaster."
- When nearbyRestaurants are provided, use them as the source of truth for restaurant recommendations.
- When an active road trip is provided, use its stops as the source of truth for follow-up trip questions.
- Do not invent restaurants, ratings, addresses, prices, open status, or links.
- When planning a trip, recommend 2 to 4 restaurants near the arena.
- Prioritize restaurants that are open, highly rated, close to the arena, and have enough user ratings.
- Mention distance from the arena when available.
- Include Google Maps links when available.
- If no restaurants are available, say restaurant data could not be loaded and continue with the game or arena plan.
- Do not invent games, dates, venues, ticket links, or distances.
- If no nearbyGames are provided for a nearby-games request, explain that live nearby games are unavailable and suggest trying a larger radius.
- When recommending games, prioritize closest distance, upcoming date, recognizable matchup, and travel practicality.
- When answering trip planning questions with nearbyGames, include the recommended game, arena or venue, date and time, city/state, approximate distance from the user, ticket link if available, and a short travel suggestion.
- If the data is missing, clearly say the app needs more data.
- Give structured answers with headings and clear recommendations.
- For trip requests, include route order, arena stops, food suggestions, and ticket links.
- Keep simple factual answers short and direct.
- Use short markdown headings like ## Summary or ## Recommendation when helpful.
- Use bullet lists for options, stops, restaurants, and ticket links.
- Avoid giant walls of text.
- Do not repeat the same field labels for every item unless they help readability.
- When the user asks a simple question, answer it first in one or two sentences, then add compact supporting bullets only if useful.
- When planning a trip, prefer this structure:
  1. ## Best Route
  2. ## Day-by-Day Stops
  3. ## Food Picks
  4. ## Ticket Links
  5. ## Notes
- If dates do not fully support an itinerary, say so clearly instead of pretending the trip fully works.

${appContext ? `Current app context:\n${appContext}\n` : ""}

${
  nearbyRestaurantsContext
    ? `Use the following live Google Places restaurant data when answering food, pregame, postgame, or trip-planning requests. Treat this as structured context, not as a suggestion. Do not invent restaurants, ratings, addresses, open status, prices, distances, or links.\n\n${nearbyRestaurantsContext}\n`
    : ""
}

${
  liveTicketmasterContext
    ? `Use the following live Ticketmaster NBA event data when answering. Treat this as structured context, not as a suggestion. Do not invent games, dates, prices, distances, or ticket links. If the data is empty or unavailable, say no matching Ticketmaster events were found.\n\n${liveTicketmasterContext}\n`
    : ""
}

User request:
${message}

NBA data:
${context}
  `.trim();
}

function hasLiveEventIntent(message: string) {
  const lowerMessage = message.toLowerCase();
  return LIVE_EVENT_INTENT_PATTERNS.some((keyword) =>
    lowerMessage.includes(keyword)
  );
}

function findTeamMention(message: string) {
  const lowerMessage = message.toLowerCase();
  return teams.find(
    (team) =>
      lowerMessage.includes(team.name.toLowerCase()) ||
      lowerMessage.includes(team.city.toLowerCase()) ||
      lowerMessage.includes(team.abbreviation.toLowerCase())
  );
}

function findArenaLocationMention(message: string) {
  const lowerMessage = message.toLowerCase();

  return arenas.find(
    (arena) =>
      lowerMessage.includes(arena.arenaName.toLowerCase()) ||
      lowerMessage.includes(arena.city.toLowerCase()) ||
      lowerMessage.includes(`${arena.city}, ${arena.state}`.toLowerCase())
  );
}

function buildAppContext(body: SilverRequestBody) {
  const contextParts: string[] = [];

  if (body.selectedTeamName) {
    contextParts.push(`Selected team: ${body.selectedTeamName}`);
  }

  if (body.selectedArenaName) {
    contextParts.push(`Selected arena: ${body.selectedArenaName}`);
  }

  if (body.context?.selectedArena?.arenaName) {
    const arena = body.context.selectedArena;
    contextParts.push(
      `Selected arena details: ${arena.arenaName} | ${[arena.city, arena.state].filter(Boolean).join(", ") || "Location not listed"} | coordinates ${
        arena.latitude != null && arena.longitude != null
          ? `${arena.latitude}, ${arena.longitude}`
          : "not listed"
      }`
    );
  }

  if (body.context?.selectedGame) {
    const game = body.context.selectedGame;
    contextParts.push(
      `Selected game venue for restaurants: ${game.name} | ${game.venue || "Unknown venue"} | coordinates ${
        game.latitude != null && game.longitude != null
          ? `${game.latitude}, ${game.longitude}`
          : "not listed"
      }`
    );
  }

  if (body.context?.activeRoadTrip) {
    const roadTrip = body.context.activeRoadTrip;
    contextParts.push(
      [
        `Active road trip: ${roadTrip.title}`,
        `Start: ${roadTrip.startLocation.label}`,
        ...roadTrip.stops.map(
          (stop) =>
            `Day ${stop.day}: ${stop.city}, ${stop.state} | ${stop.arenaName} | ${stop.teamName} | ${stop.gameTitle || "Arena exploration day"} | Food: ${stop.restaurantName}`
        ),
      ].join("\n")
    );
  }

  if (body.context?.userLocation?.latitude != null && body.context.userLocation.longitude != null) {
    const accuracy =
      body.context.userLocation.accuracy != null
        ? ` | accuracy ${Math.round(body.context.userLocation.accuracy)}m`
        : "";
    contextParts.push(
      `User location: ${body.context.userLocation.latitude}, ${body.context.userLocation.longitude}${accuracy}`
    );
  } else if (body.userLocation?.lat != null && body.userLocation?.lng != null) {
    contextParts.push(`User location: ${body.userLocation.lat}, ${body.userLocation.lng}`);
  }

  return contextParts.join("\n");
}

function getRequestLatLng(body: SilverRequestBody) {
  if (
    body.context?.userLocation?.latitude != null &&
    body.context.userLocation.longitude != null
  ) {
    return {
      lat: body.context.userLocation.latitude,
      lng: body.context.userLocation.longitude,
    };
  }

  if (body.userLocation?.lat != null && body.userLocation.lng != null) {
    return {
      lat: body.userLocation.lat,
      lng: body.userLocation.lng,
    };
  }

  return null;
}

function extractOutputText(data: OpenAIResponse) {
  if (data.output_text) {
    return data.output_text;
  }

  const messages =
    data.output
      ?.filter((item) => item.type === "message")
      .flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text ?? "")
      .join("\n")
      .trim() ?? "";

  return messages;
}

function formatOpenAIError(status: number, payload: OpenAIErrorPayload | null) {
  const message = payload?.error?.message?.trim();
  const type = payload?.error?.type?.trim();
  const code = payload?.error?.code?.trim();
  const details = [message, type, code].filter(Boolean).join(" | ");

  return details
    ? `OpenAI request failed (${status}): ${details}`
    : `OpenAI request failed (${status}).`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as SilverRequestBody;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const appContext = buildAppContext(body);
    const wantsLiveEvents = hasLiveEventIntent(message);
    let liveTicketmasterContext = "";
    const providedNearbyGames = body.context?.nearbyGames ?? [];
    const nearbyGamesSource = body.context?.nearbyGamesSource ?? null;
    const fallbackUsed = body.context?.fallbackUsed ?? false;
    const nearbyGamesError = body.context?.nearbyGamesError ?? null;
    const nearbyRestaurants = body.context?.nearbyRestaurants ?? [];
    const nearbyRestaurantsError = body.context?.nearbyRestaurantsError ?? null;
    const nearbyRestaurantsContext =
      nearbyRestaurants.length || nearbyRestaurantsError
        ? buildNearbyRestaurantsContext(
            nearbyRestaurants,
            nearbyRestaurantsError
          )
        : "";

    if (
      wantsLiveEvents &&
      (providedNearbyGames.length || nearbyGamesError || nearbyGamesSource)
    ) {
      liveTicketmasterContext = buildNearbyGamesContext(
        providedNearbyGames,
        nearbyGamesSource,
        fallbackUsed,
        nearbyGamesError
      );
    } else if (wantsLiveEvents) {
      if (!process.env.TICKETMASTER_API_KEY?.trim()) {
        return NextResponse.json({
          reply: "Live game data is not configured yet.",
        });
      }

      const teamMention = findTeamMention(message);
      const locationMention = findArenaLocationMention(message);
      const selectedTeam = body.selectedTeamName?.trim() || null;
      const selectedArena = body.selectedArenaName?.trim() || null;
      const requestLocation = getRequestLatLng(body);
      let liveEvents: NbaTicketmasterEvent[] = [];

      try {
        if (teamMention) {
          liveEvents = await searchNbaEventsByTeam(teamMention.name);
        } else if (LOCATION_INTENT_REGEX.test(message) && requestLocation) {
          liveEvents = await searchNbaEventsNearLocation(
            requestLocation.lat,
            requestLocation.lng
          );
        } else if (locationMention) {
          liveEvents = await searchNbaEventsNearLocation(
            locationMention.latitude,
            locationMention.longitude
          );
        } else if (selectedTeam) {
          liveEvents = await searchNbaEventsByTeam(selectedTeam);
        } else if (selectedArena) {
          liveEvents = await searchNbaEventsByVenue(selectedArena);
        } else if (LOCATION_INTENT_REGEX.test(message)) {
          return NextResponse.json({
            reply:
              "I can help find live Ticketmaster NBA games, but I need your location or a city, arena, or team name first.",
          });
        } else {
          return NextResponse.json({
            reply:
              "I can help with live NBA games and tickets, but I need a team, city, or arena to look up Ticketmaster events.",
          });
        }
      } catch {
        return NextResponse.json({
          reply: "Could not load live Ticketmaster games right now.",
        });
      }

      liveTicketmasterContext = buildTicketmasterContext(liveEvents);
    }

    const prompt = buildPrompt(
      message,
      liveTicketmasterContext,
      appContext,
      nearbyRestaurantsContext
    );

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    if (!response.ok) {
      let errorPayload: OpenAIErrorPayload | null = null;

      try {
        errorPayload = (await response.json()) as OpenAIErrorPayload;
      } catch {
        errorPayload = null;
      }

      return NextResponse.json(
        { error: formatOpenAIError(response.status, errorPayload) },
        { status: 500 }
      );
    }

    const data = (await response.json()) as OpenAIResponse;
    const reply =
      extractOutputText(data) || "Silver AI could not generate a response.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Silver AI failed to respond." },
      { status: 500 }
    );
  }
}
