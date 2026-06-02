"use client";

import { CalendarDays, Clock3, ExternalLink, MapPin, Ticket } from "lucide-react";
import { teams } from "@/data";
import { Button } from "@/components/ui/button";

type TicketmasterEvent = {
  id: string;
  name: string;
  date: string | null;
  time: string | null;
  timezone: string | null;
  venueName: string | null;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  ticketUrl: string | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: string | null;
  teamsOrAttractions: string[];
};

type TicketmasterEventsTabProps = {
  title: string;
  emptyMessage: string;
  events: TicketmasterEvent[];
  isLoading: boolean;
  error: string | null;
  selectedTeamName?: string;
  selectedArenaName?: string;
  buttonLabel?: string;
  showPrice?: boolean;
};

function formatPriceRange(event: TicketmasterEvent) {
  if (event.priceMin == null || event.priceMax == null || !event.currency) {
    return "Price not listed";
  }

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: event.currency,
      maximumFractionDigits: 0,
    });

    return `${formatter.format(event.priceMin)} - ${formatter.format(
      event.priceMax
    )}`;
  } catch {
    return `${event.priceMin} - ${event.priceMax} ${event.currency}`;
  }
}

function formatDisplayDate(date: string | null) {
  if (!date) {
    return "Date TBD";
  }

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatDisplayTime(event: TicketmasterEvent) {
  if (!event.time) {
    return "Time TBD";
  }

  const timezone = event.timezone?.split("/").pop()?.replace(/_/g, " ");
  return timezone ? `${event.time} ${timezone}` : event.time;
}

function findTeamByName(name: string) {
  const lowerName = name.toLowerCase();

  return teams.find(
    (team) =>
      team.name.toLowerCase() === lowerName ||
      lowerName.includes(team.name.toLowerCase()) ||
      team.name.toLowerCase().includes(lowerName)
  );
}

function findTeamsInText(text: string) {
  const lowerText = text.toLowerCase();

  return teams.filter((team) => lowerText.includes(team.name.toLowerCase()));
}

function getMatchupDetails(
  event: TicketmasterEvent,
  selectedTeamName?: string,
  selectedArenaName?: string
) {
  const selectedTeam = selectedTeamName
    ? teams.find((team) => team.name === selectedTeamName)
    : null;
  const attractionTeams = event.teamsOrAttractions
    .map(findTeamByName)
    .filter((team): team is (typeof teams)[number] => Boolean(team));
  const nameTeams = findTeamsInText(event.name);
  const eventTeams = [...attractionTeams, ...nameTeams];
  const uniqueTeams = Array.from(
    new Map(eventTeams.map((team) => [team.id, team])).values()
  );
  const selectedMentioned = selectedTeam
    ? uniqueTeams.some((team) => team.id === selectedTeam.id) ||
      event.name.toLowerCase().includes(selectedTeam.name.toLowerCase())
    : false;
  const opponent =
    uniqueTeams.find((team) => team.name !== selectedTeamName) ?? null;
  const lowerName = event.name.toLowerCase();
  const lowerSelectedName = selectedTeamName?.toLowerCase() ?? "";
  const lowerSelectedArena = selectedArenaName?.toLowerCase() ?? "";
  const venueName = event.venueName?.toLowerCase() ?? "";
  const venueCity = event.city?.toLowerCase() ?? "";
  const venueMatchesSelected =
    Boolean(lowerSelectedArena) && venueName.includes(lowerSelectedArena);
  const cityMatchesSelected = selectedTeam
    ? venueCity === selectedTeam.city.toLowerCase()
    : false;

  let isHome: boolean | null = null;

  if (selectedMentioned && lowerSelectedName) {
    if (lowerName.includes(` at ${lowerSelectedName}`)) {
      isHome = true;
    } else if (lowerName.includes(`${lowerSelectedName} at `)) {
      isHome = false;
    } else if (lowerName.includes(`${lowerSelectedName} vs `)) {
      isHome = true;
    } else if (lowerName.includes(` vs ${lowerSelectedName}`)) {
      isHome = false;
    } else if (venueMatchesSelected || cityMatchesSelected) {
      isHome = true;
    }
  }

  const homeTeam =
    isHome === true
      ? selectedTeam
      : opponent ?? (venueMatchesSelected || cityMatchesSelected ? selectedTeam : null);
  const matchupLabel =
    selectedMentioned && opponent
      ? isHome === false
        ? `at ${opponent.name}`
        : `vs ${opponent.name}`
      : event.name;
  const locationLabel =
    selectedMentioned && isHome != null
      ? isHome
        ? "Home"
        : "Away"
      : "NBA Event";

  return {
    matchupLabel,
    displayLogo: homeTeam?.logo ?? opponent?.logo ?? null,
    displayLogoAlt: homeTeam?.name ?? opponent?.name ?? event.name,
    locationLabel,
  };
}

export default function TicketmasterEventsTab({
  title,
  emptyMessage,
  events,
  isLoading,
  error,
  selectedTeamName,
  selectedArenaName,
  buttonLabel = "Details",
  showPrice = false,
}: TicketmasterEventsTabProps) {
  if (isLoading) {
    return (
      <div className="py-4">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <div className="space-y-3">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/8 bg-[#202631] p-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 animate-pulse rounded-lg bg-white/8" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-white/8" />
                  <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  <div className="flex gap-3">
                    <div className="h-4 w-28 animate-pulse rounded bg-white/8" />
                    <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  </div>
                </div>
                <div className="h-10 w-24 animate-pulse rounded-md bg-emerald-500/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          Could not load upcoming games right now.
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="py-4">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4 text-sm text-zinc-300">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>

      <div className="space-y-4">
        {events.map((event) => {
          const matchup = getMatchupDetails(
            event,
            selectedTeamName,
            selectedArenaName
          );

          return (
            <article
              key={event.id}
              className="rounded-lg border border-white/8 bg-[#202631] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.14)] transition hover:border-white/15"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#171c25] ring-1 ring-white/6">
                  {matchup.displayLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={matchup.displayLogo}
                      alt={matchup.displayLogoAlt}
                      className="h-11 w-11 object-contain"
                    />
                  ) : (
                    <Ticket className="h-7 w-7 text-zinc-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="break-words text-[15px] font-semibold leading-5 text-white sm:text-[16px]">
                        {matchup.matchupLabel}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{matchup.locationLabel}</span>
                      </div>
                    </div>

                    {showPrice ? (
                      <div className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                        {formatPriceRange(event)}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>{formatDisplayDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0" />
                        <span>{formatDisplayTime(event)}</span>
                      </div>
                    </div>

                    {event.ticketUrl ? (
                      <Button
                        asChild
                        className="h-10 rounded-md bg-[#0b9d43] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(11,157,67,0.18)] hover:bg-[#10ad4b]"
                      >
                        <a href={event.ticketUrl} target="_blank" rel="noreferrer">
                          <span>{buttonLabel}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <div className="text-xs text-zinc-500">Ticket link unavailable</div>
                    )}
                  </div>

                  <div className="mt-3 text-xs leading-5 text-zinc-500">
                    {event.venueName || "Venue not listed"}
                    {event.city || event.state
                      ? ` • ${[event.city, event.state].filter(Boolean).join(", ")}`
                      : ""}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
