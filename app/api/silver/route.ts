import { NextResponse } from "next/server";
import { arenas, teams, games, restaurants } from "@/data";

type SilverRequestBody = {
  message?: string;
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

function buildPrompt(message: string) {
  const context = buildArenaContext();

  return `
You are Silver AI, an NBA arena explorer assistant, road trip planner, arena guide, and game recommendation assistant.

Rules:
- Use only the provided NBA data when giving arena, game, restaurant, or ticket information.
- Do not invent live schedules, prices, or ticket availability.
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

User request:
${message}

NBA data:
${context}
  `.trim();
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

    const prompt = buildPrompt(message);

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
