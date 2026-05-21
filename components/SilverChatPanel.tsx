"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ExternalLink,
  MapPin,
  Route,
  Send,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import SilverMessageContent from "@/components/SilverMessageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { arenas } from "@/data";
import {
  fetchNearbyNBAGames,
  type NearbyGamesSource,
  type NearbyNBAGame,
} from "@/src/lib/ticketmaster";
import {
  fetchNearbyRestaurants,
  type NearbyRestaurant,
} from "@/src/lib/restaurants";
import { useUserLocation } from "@/src/hooks/useUserLocation";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type SilverApiResponse = {
  reply?: string;
  error?: string;
};

type SilverChatPanelProps = {
  open: boolean;
  onClose: () => void;
  selectedTeamName: string | null;
  selectedArenaName: string | null;
};

const SUGGESTIONS = [
  "Plan a 3-day NBA road trip",
  "Find arenas near me",
  "Best West Coast arena route",
];

const NEARBY_GAME_INTENT_REGEX =
  /\b(closest games|nearby games|games near me|plan a trip|road trip|tickets?|arena near me|nba game near me|weekend game|near me|nearby|closest)\b/i;
const RESTAURANT_INTENT_REGEX =
  /\b(restaurant|restaurants|food|eat|dinner|lunch|pregame|pre-game|postgame|post-game|before tipoff|before the game|after the game|full nba trip|plan a trip|road trip)\b/i;

const STARTER_MESSAGE: Message = {
  id: "starter-assistant",
  role: "assistant",
  content:
    "Hey, I’m Silver. Ask me to plan an NBA road trip, find nearby arenas, or compare teams and venues.",
};

function toSilverLocation(
  location: { latitude: number; longitude: number } | null
) {
  if (!location) {
    return null;
  }

  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}

function formatPriceLevel(priceLevel: string | null) {
  if (!priceLevel) {
    return null;
  }

  return priceLevel
    .replace(/^PRICE_LEVEL_/, "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function SilverChatPanel({
  open,
  onClose,
  selectedTeamName,
  selectedArenaName,
}: SilverChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([STARTER_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNearbyGamesLoading, setIsNearbyGamesLoading] = useState(false);
  const [nearbyGamesCount, setNearbyGamesCount] = useState<number | null>(null);
  const [nearbyGamesSource, setNearbyGamesSource] =
    useState<NearbyGamesSource | null>(null);
  const [nearbyGamesError, setNearbyGamesError] = useState<string | null>(null);
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant[]>(
    []
  );
  const [nearbyRestaurantsError, setNearbyRestaurantsError] = useState<
    string | null
  >(null);
  const [nearbyRestaurantsLoaded, setNearbyRestaurantsLoaded] = useState(false);
  const [restaurantSearchLabel, setRestaurantSearchLabel] = useState<
    string | null
  >(null);
  const {
    location: userLocation,
    loading: isLocationLoading,
    error: locationError,
    getUserLocation,
  } = useUserLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageIdRef = useRef(0);

  const suggestionChips = useMemo(() => SUGGESTIONS, []);
  const selectedArena = useMemo(
    () =>
      selectedArenaName
        ? arenas.find((arena) => arena.arenaName === selectedArenaName) ?? null
        : null,
    [selectedArenaName]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timeoutId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const shouldFetchNearbyGames = (message: string) =>
    NEARBY_GAME_INTENT_REGEX.test(message);
  const shouldFetchRestaurants = (message: string) =>
    RESTAURANT_INTENT_REGEX.test(message);

  const maybeResolveUserLocation = async (message: string) => {
    if (!shouldFetchNearbyGames(message) && !shouldFetchRestaurants(message)) {
      return userLocation;
    }

    if (userLocation) {
      return userLocation;
    }

    try {
      const resolvedLocation = await getUserLocation();

      if (resolvedLocation) {
        return resolvedLocation;
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleUseLocation = async () => {
    // User clicks the button; the hook asks the browser for permission.
    // If allowed, the hook stores latitude and longitude in component state.
    // If denied, the hook exposes a friendly error for the UI.
    await getUserLocation();
  };

  const maybeFetchNearbyGames = async (message: string) => {
    if (!shouldFetchNearbyGames(message)) {
      return {
        nearbyGames: [] as NearbyNBAGame[],
        nearbyGamesError: null as string | null,
        nearbyGamesSource: null as NearbyGamesSource | null,
        fallbackUsed: false,
      };
    }

    const resolvedLocation = await maybeResolveUserLocation(message);

    if (!resolvedLocation) {
      return {
        nearbyGames: [] as NearbyNBAGame[],
        nearbyGamesError:
          "Live nearby games were not loaded because your browser location is unavailable.",
        nearbyGamesSource: null as NearbyGamesSource | null,
        fallbackUsed: false,
        resolvedLocation,
      };
    }

    setIsNearbyGamesLoading(true);
    setNearbyGamesError(null);

    try {
      const nearbyGamesResult = await fetchNearbyNBAGames(resolvedLocation);
      setNearbyGamesCount(nearbyGamesResult.games.length);
      setNearbyGamesSource(nearbyGamesResult.source);

      return {
        nearbyGames: nearbyGamesResult.games,
        nearbyGamesError: null,
        nearbyGamesSource: nearbyGamesResult.source,
        fallbackUsed: nearbyGamesResult.fallbackUsed,
        resolvedLocation,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Live nearby games could not be loaded.";
      setNearbyGamesCount(null);
      setNearbyGamesSource(null);
      setNearbyGamesError(errorMessage);

      return {
        nearbyGames: [] as NearbyNBAGame[],
        nearbyGamesError: errorMessage,
        nearbyGamesSource: null as NearbyGamesSource | null,
        fallbackUsed: false,
        resolvedLocation,
      };
    } finally {
      setIsNearbyGamesLoading(false);
    }
  };

  const maybeFetchNearbyRestaurants = async ({
    message,
    resolvedLocation,
    nearbyGames,
  }: {
    message: string;
    resolvedLocation: { latitude: number; longitude: number } | null;
    nearbyGames: NearbyNBAGame[];
  }) => {
    if (!shouldFetchRestaurants(message)) {
      return {
        nearbyRestaurants: [] as NearbyRestaurant[],
        nearbyRestaurantsError: null as string | null,
        selectedGame: null as NearbyNBAGame | null,
      };
    }

    const selectedGame =
      nearbyGames.find(
        (game) => game.latitude != null && game.longitude != null
      ) ?? null;
    const targetLocation = selectedGame
      ? {
          latitude: selectedGame.latitude as number,
          longitude: selectedGame.longitude as number,
        }
      : selectedArena
        ? {
            latitude: selectedArena.latitude,
            longitude: selectedArena.longitude,
          }
        : resolvedLocation;
    const targetLabel =
      selectedGame?.venue ??
      selectedArena?.arenaName ??
      (targetLocation ? "your location" : null);

    if (!targetLocation) {
      const errorMessage =
        "Could not load restaurants because no arena, game venue, or location is available.";
      setNearbyRestaurants([]);
      setNearbyRestaurantsLoaded(false);
      setRestaurantSearchLabel(null);
      setNearbyRestaurantsError(errorMessage);

      return {
        nearbyRestaurants: [] as NearbyRestaurant[],
        nearbyRestaurantsError: errorMessage,
        selectedGame,
      };
    }

    setIsRestaurantsLoading(true);
    setNearbyRestaurantsError(null);
    setNearbyRestaurantsLoaded(false);
    setRestaurantSearchLabel(targetLabel);

    try {
      const result = await fetchNearbyRestaurants(targetLocation);
      setNearbyRestaurants(result.restaurants);
      setNearbyRestaurantsLoaded(true);

      return {
        nearbyRestaurants: result.restaurants,
        nearbyRestaurantsError: null,
        selectedGame,
      };
    } catch {
      const errorMessage = "Could not load restaurants right now.";
      setNearbyRestaurants([]);
      setNearbyRestaurantsLoaded(false);
      setNearbyRestaurantsError(errorMessage);

      return {
        nearbyRestaurants: [] as NearbyRestaurant[],
        nearbyRestaurantsError: errorMessage,
        selectedGame,
      };
    } finally {
      setIsRestaurantsLoading(false);
    }
  };

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();

    if (!message || isLoading) {
      return;
    }

    messageIdRef.current += 1;
    const userId = messageIdRef.current;

    const userMessage: Message = {
      id: `user-${userId}`,
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    setIsLoading(true);

    try {
      const {
        nearbyGames,
        nearbyGamesError: liveNearbyGamesError,
        nearbyGamesSource: liveNearbyGamesSource,
        fallbackUsed,
        resolvedLocation = await maybeResolveUserLocation(message),
      } = await maybeFetchNearbyGames(message);
      const {
        nearbyRestaurants: liveNearbyRestaurants,
        nearbyRestaurantsError: liveNearbyRestaurantsError,
        selectedGame,
      } = await maybeFetchNearbyRestaurants({
        message,
        resolvedLocation,
        nearbyGames,
      });

      const response = await fetch("/api/silver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          selectedTeamName,
          selectedArenaName,
          userLocation: toSilverLocation(resolvedLocation),
          context: {
            userLocation: resolvedLocation
              ? {
                  latitude: resolvedLocation.latitude,
                  longitude: resolvedLocation.longitude,
                  accuracy: resolvedLocation.accuracy ?? null,
                }
              : null,
            nearbyGames,
            nearbyGamesSource: liveNearbyGamesSource,
            fallbackUsed,
            nearbyGamesError: liveNearbyGamesError,
            selectedArena,
            selectedGame,
            nearbyRestaurants: liveNearbyRestaurants,
            nearbyRestaurantsError: liveNearbyRestaurantsError,
          },
        }),
      });

      const data = (await response.json()) as SilverApiResponse;

      messageIdRef.current += 1;
      const assistantId = messageIdRef.current;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${assistantId}`,
          role: "assistant",
          content:
            data.reply ||
            data.error ||
            "Silver AI could not generate a response.",
        },
      ]);
    } catch {
      messageIdRef.current += 1;
      const assistantId = messageIdRef.current;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${assistantId}`,
          role: "assistant",
          content:
            "Silver AI could not reach the server. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await sendMessage(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close Silver AI chat"
            className="fixed inset-0 z-[84] bg-black/60 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.section
            aria-label="Silver AI chat panel"
            className="fixed inset-x-0 bottom-0 z-[85] mx-auto flex h-[66vh] max-h-[760px] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,12,20,0.98)_0%,rgba(6,10,18,0.98)_100%)] shadow-[0_-32px_120px_rgba(0,0,0,0.6)]"
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-white/12" />

            <header className="border-b border-white/8 px-5 pb-4 pt-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                      <Bot className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-white">
                          Silver AI
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                          Online
                        </span>
                      </div>
                      <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                        Plan NBA road trips, compare arenas, and find games near
                        you.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-xl border border-white/8 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void handleUseLocation();
                  }}
                  disabled={isLocationLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MapPin className="h-3.5 w-3.5 text-cyan-300" />
                  <span>
                    {isLocationLoading ? "Getting location..." : "Use My Location"}
                  </span>
                </button>

                {suggestionChips.map((suggestion, index) => {
                  const icons = [Route, MapPin, Sparkles] as const;
                  const Icon = icons[index] ?? Sparkles;

                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        void sendMessage(suggestion);
                      }}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5 text-cyan-300" />
                      <span>{suggestion}</span>
                    </button>
                  );
                })}
              </div>

              {userLocation ? (
                <p className="text-xs leading-5 text-zinc-400">
                  Location saved: {userLocation.latitude.toFixed(5)},{" "}
                  {userLocation.longitude.toFixed(5)}
                  <span className="text-zinc-500">
                    {" "}
                    ({Math.round(userLocation.accuracy)}m accuracy)
                  </span>
                </p>
              ) : null}

              {locationError ? (
                <p className="text-xs leading-5 text-amber-200/90">
                  {locationError}
                </p>
              ) : null}

              {isNearbyGamesLoading ? (
                <p className="text-xs leading-5 text-cyan-200/90">
                  Checking live NBA games near you...
                </p>
              ) : null}

              {nearbyGamesCount != null && !isNearbyGamesLoading ? (
                <p className="text-xs leading-5 text-zinc-500">
                  Live nearby games loaded: {nearbyGamesCount}
                  {nearbyGamesSource === "ticketmaster_basketball_filtered"
                    ? " (filtered basketball search)"
                    : ""}
                </p>
              ) : null}

              {nearbyGamesError ? (
                <p className="text-xs leading-5 text-amber-200/90">
                  {nearbyGamesError}
                </p>
              ) : null}

              {isRestaurantsLoading ? (
                <p className="text-xs leading-5 text-cyan-200/90">
                  Finding restaurants near the arena...
                </p>
              ) : null}

              {nearbyRestaurantsError ? (
                <p className="text-xs leading-5 text-amber-200/90">
                  {nearbyRestaurantsError}
                </p>
              ) : null}

              {nearbyRestaurantsLoaded && !nearbyRestaurants.length ? (
                <p className="text-xs leading-5 text-zinc-500">
                  No nearby restaurants found.
                </p>
              ) : null}

              {nearbyRestaurants.length ? (
                <section className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Utensils
                        className="h-4 w-4 shrink-0 text-cyan-300"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white">
                          Nearby Restaurants
                        </h3>
                        {restaurantSearchLabel ? (
                          <p className="truncate text-xs text-zinc-500">
                            Near {restaurantSearchLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {nearbyRestaurants.slice(0, 4).map((restaurant) => {
                      const priceLevel = formatPriceLevel(restaurant.priceLevel);

                      return (
                        <article
                          key={restaurant.id}
                          className="rounded-xl border border-white/8 bg-black/20 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold text-zinc-100">
                                {restaurant.name}
                              </h4>
                              <p className="mt-1 text-xs leading-5 text-zinc-400">
                                {restaurant.rating != null
                                  ? `${restaurant.rating.toFixed(1)} rating`
                                  : "Rating unavailable"}
                                {restaurant.userRatingCount != null
                                  ? ` · ${restaurant.userRatingCount} reviews`
                                  : ""}
                              </p>
                            </div>

                            {restaurant.googleMapsUrl ? (
                              <a
                                href={restaurant.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${restaurant.name} in Google Maps`}
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 transition hover:bg-cyan-300/15"
                              >
                                <ExternalLink
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                              </a>
                            ) : null}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
                            {priceLevel ? (
                              <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                                {priceLevel}
                              </span>
                            ) : null}
                            {restaurant.openNow != null ? (
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-1",
                                  restaurant.openNow
                                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                                    : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                                )}
                              >
                                {restaurant.openNow ? "Open now" : "Closed"}
                              </span>
                            ) : null}
                            {restaurant.distanceMiles != null ? (
                              <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                                {restaurant.distanceMiles.toFixed(1)} mi
                              </span>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-lg sm:max-w-[75%]",
                        message.role === "user"
                          ? "border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.18)_0%,rgba(59,130,246,0.2)_100%)] text-white shadow-cyan-900/20"
                          : "border-white/8 bg-white/[0.04] text-zinc-100 shadow-black/20"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85">
                          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                          Silver
                        </div>
                      ) : null}
                      {message.role === "assistant" ? (
                        <SilverMessageContent content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-zinc-100 shadow-lg shadow-black/20 sm:max-w-[75%]">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85">
                        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                        Silver
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/80" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/60 [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300/40 [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/8 bg-black/15 px-5 pb-5 pt-4 sm:px-6">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-inner shadow-black/10">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Silver about NBA trips, arenas, games…"
                  disabled={isLoading}
                  className="h-12 flex-1 rounded-xl border-0 bg-transparent px-3 text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <Button
                  type="button"
                  onClick={() => {
                    void handleSubmit();
                  }}
                  disabled={!input.trim() || isLoading}
                  className="h-12 rounded-xl bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_50%,#06b6d4_100%)] px-4 text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)] hover:opacity-95"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {isLoading ? "Sending..." : "Send"}
                  </span>
                </Button>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
