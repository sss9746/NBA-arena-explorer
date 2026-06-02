"use client";

import {
  CalendarDays,
  ExternalLink,
  Route,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import type { RoadTripItinerary } from "@/src/lib/roadTripPlanner";

type RoadTripPanelProps = {
  roadTrip: RoadTripItinerary;
  onClear: () => void;
};

function formatGameDate(gameDate: string | null) {
  if (!gameDate) {
    return null;
  }

  const parsed = new Date(gameDate);

  if (Number.isNaN(parsed.getTime())) {
    return gameDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: gameDate.includes("T") ? "numeric" : undefined,
    minute: gameDate.includes("T") ? "2-digit" : undefined,
  }).format(parsed);
}

function formatWindowDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function getTripTypeLabel(roadTrip: RoadTripItinerary) {
  if (roadTrip.mode === "single_game_plan") {
    return "Single Game Plan";
  }

  if (roadTrip.mode === "no_games_found") {
    return "No Games Found";
  }

  return "Multi-Game Road Trip";
}

export default function RoadTripPanel({
  roadTrip,
  onClear,
}: RoadTripPanelProps) {
  return (
    <aside className="dark fixed right-0 top-0 z-[70] flex h-screen w-full max-w-[92vw] flex-col overflow-hidden border-l border-white/10 bg-[#11151d] text-white shadow-2xl shadow-black/50 sm:w-[460px]">
      <header className="shrink-0 border-b border-white/8 px-5 pb-5 pt-6 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <Route className="h-4 w-4" aria-hidden="true" />
              Silver Route
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {roadTrip.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {roadTrip.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            aria-label="Clear road trip"
            title="Clear road trip"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/8 bg-white/[0.04] text-zinc-300 transition hover:bg-white/8 hover:text-white"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
            Road Trip Summary
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <dt className="text-zinc-500">Start</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {roadTrip.startLocation.label}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Trip Window</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {formatWindowDate(roadTrip.tripStartDate)} -{" "}
                {formatWindowDate(roadTrip.tripEndDate)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Trip Type</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {getTripTypeLabel(roadTrip)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Games Found</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {roadTrip.stops.filter((stop) => Boolean(stop.gameTitle)).length}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Stops</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {roadTrip.stops.length}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Total Distance</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {roadTrip.totalDistanceText}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-500">Estimated Drive Time</dt>
              <dd className="mt-1 font-semibold text-cyan-50">
                {roadTrip.totalDriveTimeText}
              </dd>
            </div>
          </dl>
        </div>
        {roadTrip.routeCoordinates.length >= 2 ? (
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Route is estimated using direct map connections.
          </p>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {roadTrip.mode === "no_games_found" ? (
          <div className="rounded-lg border border-white/8 bg-white/[0.04] p-4 text-sm leading-6 text-zinc-300">
            No NBA games were found within your 3-day window. Try another
            starting city or check again for a different date window.
          </div>
        ) : (
          <div className="space-y-4">
            {roadTrip.stops.map((stop) => {
              const gameDate = formatGameDate(stop.gameDate);

              return (
                <article
                  key={`${stop.day}-${stop.arenaName}`}
                  className="rounded-lg border border-white/8 bg-[#202631] p-4 shadow-[0_14px_28px_rgba(0,0,0,0.12)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-900/30">
                      {stop.day}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        Day {stop.day}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-white">
                        {stop.city}, {stop.state}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-300">
                        Arena: {stop.arenaName}
                      </p>
                      <p className="text-xs text-zinc-500">{stop.teamName}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-white/8 pt-4">
                    <div className="flex gap-2.5">
                      <Route className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          Travel
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-zinc-400">
                          {stop.travelFromPrevious.distanceText},{" "}
                          {stop.travelFromPrevious.durationText}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          Game
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-zinc-400">
                          {stop.gameTitle ?? "Arena exploration day"}
                        </p>
                        {gameDate ? (
                          <p className="text-xs leading-5 text-zinc-500">
                            Time: {gameDate}
                          </p>
                        ) : null}
                        {stop.ticketUrl ? (
                          <a
                            href={stop.ticketUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
                          >
                            Tickets
                            <ExternalLink
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">
                          Food
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-zinc-400">
                          {stop.restaurantName}
                        </p>
                        {stop.restaurantAddress ? (
                          <p className="text-xs leading-5 text-zinc-500">
                            {stop.restaurantAddress}
                          </p>
                        ) : null}
                        {stop.restaurantMapsUrl ? (
                          <a
                            href={stop.restaurantMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                          >
                            Open in Maps
                            <ExternalLink
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 rounded-md bg-black/20 px-3 py-2.5 text-xs leading-5 text-zinc-400">
                    {stop.notes}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {roadTrip.warnings.length ? (
          <section className="mt-5 rounded-lg border border-amber-300/15 bg-amber-300/10 p-4">
            <h3 className="text-xs font-semibold text-amber-100">Trip notes</h3>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-amber-100/80">
              {roadTrip.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/8 hover:text-white"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Clear Road Trip
        </button>
      </div>
    </aside>
  );
}
