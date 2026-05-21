"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Landmark,
  MapPin,
  RefreshCw,
  Ticket,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ArenaDetailsTab from "@/components/ui/ArenaDetailsTab";
import HeroBanner from "@/components/ui/HeroBanner";
import PanelHeader from "@/components/ui/PanelHeader";
import PlayersTab from "@/components/ui/PlayersTab";
import TicketmasterEventsTab from "@/components/ui/TicketmasterEventsTab";
import { arenas as nbaArenas } from "@/data";
import { fetchNearbyRestaurants } from "@/src/lib/restaurants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const TEAM_DETAILS = {
  "Golden State Warriors": {
    arena: "Chase Center",
    location: "San Francisco, CA",
    code: "GSW",
    capacity: "18,064",
    yearBuilt: "2019",
    color: "#fbbf24",
  },
  "Los Angeles Lakers": {
    arena: "Crypto.com Arena",
    location: "Los Angeles, CA",
    code: "LAL",
    capacity: "19,079",
    yearBuilt: "1999",
    color: "#a855f7",
  },
  "Los Angeles Clippers": {
    arena: "Intuit Dome",
    location: "Inglewood, CA",
    code: "LAC",
    capacity: "18,000",
    yearBuilt: "2024",
    color: "#ef4444",
  },
  "Phoenix Suns": {
    arena: "Footprint Center",
    location: "Phoenix, AZ",
    code: "PHX",
    capacity: "17,071",
    yearBuilt: "1992",
    color: "#f97316",
  },
  "Sacramento Kings": {
    arena: "Golden 1 Center",
    location: "Sacramento, CA",
    code: "SAC",
    capacity: "17,608",
    yearBuilt: "2016",
    color: "#8b5cf6",
  },
  "Portland Trail Blazers": {
    arena: "Moda Center",
    location: "Portland, OR",
    code: "POR",
    capacity: "19,393",
    yearBuilt: "1995",
  },
  "Utah Jazz": {
    arena: "Delta Center",
    location: "Salt Lake City, UT",
    code: "UTA",
    capacity: "18,306",
    yearBuilt: "1991",
  },
  "Denver Nuggets": {
    arena: "Ball Arena",
    location: "Denver, CO",
    code: "DEN",
    capacity: "19,520",
    yearBuilt: "1999",
  },
  "Oklahoma City Thunder": {
    arena: "Paycom Center",
    location: "Oklahoma City, OK",
    code: "OKC",
    capacity: "18,203",
    yearBuilt: "2002",
  },
  "Minnesota Timberwolves": {
    arena: "Target Center",
    location: "Minneapolis, MN",
    code: "MIN",
    capacity: "18,798",
    yearBuilt: "1990",
  },
  "Dallas Mavericks": {
    arena: "American Airlines Center",
    location: "Dallas, TX",
    code: "DAL",
    capacity: "19,200",
    yearBuilt: "2001",
  },
  "Houston Rockets": {
    arena: "Toyota Center",
    location: "Houston, TX",
    code: "HOU",
    capacity: "18,055",
    yearBuilt: "2003",
  },
  "San Antonio Spurs": {
    arena: "Frost Bank Center",
    location: "San Antonio, TX",
    code: "SAS",
    capacity: "18,418",
    yearBuilt: "2002",
  },
  "New Orleans Pelicans": {
    arena: "Smoothie King Center",
    location: "New Orleans, LA",
    code: "NOP",
    capacity: "16,867",
    yearBuilt: "1999",
  },
  "Memphis Grizzlies": {
    arena: "FedExForum",
    location: "Memphis, TN",
    code: "MEM",
    capacity: "18,119",
    yearBuilt: "2004",
  },
  "Boston Celtics": {
    arena: "TD Garden",
    location: "Boston, MA",
    code: "BOS",
    capacity: "19,156",
    yearBuilt: "1995",
    color: "#22c55e",
  },
  "Brooklyn Nets": {
    arena: "Barclays Center",
    location: "Brooklyn, NY",
    code: "BKN",
    capacity: "17,732",
    yearBuilt: "2012",
  },
  "New York Knicks": {
    arena: "Madison Square Garden",
    location: "New York, NY",
    code: "NYK",
    capacity: "19,812",
    yearBuilt: "1968",
  },
  "Philadelphia 76ers": {
    arena: "Wells Fargo Center",
    location: "Philadelphia, PA",
    code: "PHI",
    capacity: "20,478",
    yearBuilt: "1996",
  },
  "Toronto Raptors": {
    arena: "Scotiabank Arena",
    location: "Toronto, ON",
    code: "TOR",
    capacity: "19,800",
    yearBuilt: "1999",
  },
  "Chicago Bulls": {
    arena: "United Center",
    location: "Chicago, IL",
    code: "CHI",
    capacity: "20,917",
    yearBuilt: "1994",
    color: "#ef4444",
  },
  "Cleveland Cavaliers": {
    arena: "Rocket Arena",
    location: "Cleveland, OH",
    code: "CLE",
    capacity: "19,432",
    yearBuilt: "1994",
  },
  "Detroit Pistons": {
    arena: "Little Caesars Arena",
    location: "Detroit, MI",
    code: "DET",
    capacity: "20,062",
    yearBuilt: "2017",
  },
  "Indiana Pacers": {
    arena: "Gainbridge Fieldhouse",
    location: "Indianapolis, IN",
    code: "IND",
    capacity: "17,274",
    yearBuilt: "1999",
  },
  "Milwaukee Bucks": {
    arena: "Fiserv Forum",
    location: "Milwaukee, WI",
    code: "MIL",
    capacity: "17,341",
    yearBuilt: "2018",
  },
  "Atlanta Hawks": {
    arena: "State Farm Arena",
    location: "Atlanta, GA",
    code: "ATL",
    capacity: "16,888",
    yearBuilt: "1999",
  },
  "Charlotte Hornets": {
    arena: "Spectrum Center",
    location: "Charlotte, NC",
    code: "CHA",
    capacity: "19,077",
    yearBuilt: "2005",
  },
  "Miami Heat": {
    arena: "Kaseya Center",
    location: "Miami, FL",
    code: "MIA",
    capacity: "19,600",
    yearBuilt: "1999",
    color: "#f97316",
  },
  "Orlando Magic": {
    arena: "Kia Center",
    location: "Orlando, FL",
    code: "ORL",
    capacity: "18,846",
    yearBuilt: "2010",
  },
  "Washington Wizards": {
    arena: "Capital One Arena",
    location: "Washington, DC",
    code: "WAS",
    capacity: "20,356",
    yearBuilt: "1997",
  },
};

const PANEL_TABS = [
  { id: "players", label: "Players", icon: Users },
  { id: "arena", label: "Arena", icon: Landmark },
  { id: "games", label: "Games", icon: CalendarDays },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "restaurants", label: "Food", icon: UtensilsCrossed },
];

const teams = [
  { name: "Golden State Warriors", coordinates: [-122.3877, 37.768], logo: "/logos/warriors.png", arenaImage: "/arenas/warriors-arena.jpg", players: [{ name: "Stephen Curry", image: "/players/curry.jpeg" }, { name: "Warriors Player 2", image: "/players/warriors-player-2.jpg" }] },
  { name: "Los Angeles Lakers", coordinates: [-118.2673, 34.043], logo: "/logos/lakers.png", arenaImage: "/arenas/lakers-arena.jpg", players: [{ name: "Lakers Player 1", image: "/players/lakers-player-1.jpg" }, { name: "Lakers Player 2", image: "/players/lakers-player-2.jpg" }] },
  { name: "Los Angeles Clippers", coordinates: [-118.3431, 33.945], logo: "/logos/clippers.png", arenaImage: "/arenas/clippers-arena.jpg", players: [{ name: "Clippers Player 1", image: "/players/clippers-player-1.jpg" }, { name: "Clippers Player 2", image: "/players/clippers-player-2.jpg" }] },
  { name: "Phoenix Suns", coordinates: [-112.0712, 33.4457], logo: "/logos/suns.png", arenaImage: "/arenas/suns-arena.jpg", players: [{ name: "Suns Player 1", image: "/players/suns-player-1.jpg" }, { name: "Suns Player 2", image: "/players/suns-player-2.jpg" }] },
  { name: "Sacramento Kings", coordinates: [-121.4994, 38.5802], logo: "/logos/kings.png", arenaImage: "/arenas/kings-arena.jpg", players: [{ name: "Kings Player 1", image: "/players/kings-player-1.jpg" }, { name: "Kings Player 2", image: "/players/kings-player-2.jpg" }] },
  { name: "Portland Trail Blazers", coordinates: [-122.6668, 45.5316], logo: "/logos/blazzers.png", arenaImage: "/arenas/blazers-arena.jpg", players: [{ name: "Blazers Player 1", image: "/players/blazers-player-1.jpg" }, { name: "Blazers Player 2", image: "/players/blazers-player-2.jpg" }] },
  { name: "Utah Jazz", coordinates: [-111.9011, 40.7683], logo: "/logos/jazz.png", arenaImage: "/arenas/jazz-arena.jpg", players: [{ name: "Jazz Player 1", image: "/players/jazz-player-1.jpg" }, { name: "Jazz Player 2", image: "/players/jazz-player-2.jpg" }] },
  { name: "Denver Nuggets", coordinates: [-105.0077, 39.7487], logo: "/logos/nuggets.png", arenaImage: "/arenas/nuggets-arena.jpg", players: [{ name: "Nuggets Player 1", image: "/players/nuggets-player-1.jpg" }, { name: "Nuggets Player 2", image: "/players/nuggets-player-2.jpg" }] },
  { name: "Oklahoma City Thunder", coordinates: [-97.5151, 35.4634], logo: "/logos/thunder.png", arenaImage: "/arenas/thunder-arena.jpg", players: [{ name: "Thunder Player 1", image: "/players/thunder-player-1.jpg" }, { name: "Thunder Player 2", image: "/players/thunder-player-2.jpg" }] },
  { name: "Minnesota Timberwolves", coordinates: [-93.276, 44.9795], logo: "/logos/timberwolves.png", arenaImage: "/arenas/timberwolves-arena.jpg", players: [{ name: "Timberwolves Player 1", image: "/players/timberwolves-player-1.jpg" }, { name: "Timberwolves Player 2", image: "/players/timberwolves-player-2.jpg" }] },
  { name: "Dallas Mavericks", coordinates: [-96.8103, 32.7905], logo: "/logos/mavericks.png", arenaImage: "/arenas/mavericks-arena.jpg", players: [{ name: "Mavericks Player 1", image: "/players/mavericks-player-1.jpg" }, { name: "Mavericks Player 2", image: "/players/mavericks-player-2.jpg" }] },
  { name: "Houston Rockets", coordinates: [-95.3621, 29.7508], logo: "/logos/rockets.png", arenaImage: "/arenas/rockets-arena.jpg", players: [{ name: "Rockets Player 1", image: "/players/rockets-player-1.jpg" }, { name: "Rockets Player 2", image: "/players/rockets-player-2.jpg" }] },
  { name: "San Antonio Spurs", coordinates: [-98.4375, 29.427], logo: "/logos/spurs.png", arenaImage: "/arenas/spurs-arena.jpg", players: [{ name: "Spurs Player 1", image: "/players/spurs-player-1.jpg" }, { name: "Spurs Player 2", image: "/players/spurs-player-2.jpg" }] },
  { name: "New Orleans Pelicans", coordinates: [-90.0815, 29.949], logo: "/logos/pelicans.png", arenaImage: "/arenas/pelicans-arena.jpg", players: [{ name: "Pelicans Player 1", image: "/players/pelicans-player-1.jpg" }, { name: "Pelicans Player 2", image: "/players/pelicans-player-2.jpg" }] },
  { name: "Memphis Grizzlies", coordinates: [-90.0505, 35.1382], logo: "/logos/grizzlies.png", arenaImage: "/arenas/grizzlies-arena.jpg", players: [{ name: "Grizzlies Player 1", image: "/players/grizzlies-player-1.jpg" }, { name: "Grizzlies Player 2", image: "/players/grizzlies-player-2.jpg" }] },
  { name: "Boston Celtics", coordinates: [-71.0622, 42.3662], logo: "/logos/celtics.png", arenaImage: "/arenas/celtics-arena.jpg", players: [{ name: "Celtics Player 1", image: "/players/celtics-player-1.jpg" }, { name: "Celtics Player 2", image: "/players/celtics-player-2.jpg" }] },
  { name: "Brooklyn Nets", coordinates: [-73.9754, 40.6826], logo: "/logos/nets.png", arenaImage: "/arenas/nets-arena.jpg", players: [{ name: "Nets Player 1", image: "/players/nets-player-1.jpg" }, { name: "Nets Player 2", image: "/players/nets-player-2.jpg" }] },
  { name: "New York Knicks", coordinates: [-73.9934, 40.7505], logo: "/logos/knicks.png", arenaImage: "/arenas/knicks-arena.jpg", players: [{ name: "Knicks Player 1", image: "/players/knicks-player-1.jpg" }, { name: "Knicks Player 2", image: "/players/knicks-player-2.jpg" }] },
  { name: "Philadelphia 76ers", coordinates: [-75.1719, 39.9012], logo: "/logos/sixers.png", arenaImage: "/arenas/sixers-arena.jpg", players: [{ name: "76ers Player 1", image: "/players/sixers-player-1.jpg" }, { name: "76ers Player 2", image: "/players/sixers-player-2.jpg" }] },
  { name: "Toronto Raptors", coordinates: [-79.3791, 43.6435], logo: "/logos/raptors.png", arenaImage: "/arenas/raptors-arena.jpg", players: [{ name: "Raptors Player 1", image: "/players/raptors-player-1.jpg" }, { name: "Raptors Player 2", image: "/players/raptors-player-2.jpg" }] },
  { name: "Chicago Bulls", coordinates: [-87.6742, 41.8807], logo: "/logos/bulls.png", arenaImage: "/arenas/bulls-arena.jpg", players: [{ name: "Bulls Player 1", image: "/players/bulls-player-1.jpg" }, { name: "Bulls Player 2", image: "/players/bulls-player-2.jpg" }] },
  { name: "Cleveland Cavaliers", coordinates: [-81.6881, 41.4965], logo: "/logos/cavaliers.png", arenaImage: "/arenas/cavaliers-arena.jpg", players: [{ name: "Cavaliers Player 1", image: "/players/cavaliers-player-1.jpg" }, { name: "Cavaliers Player 2", image: "/players/cavaliers-player-2.jpg" }] },
  { name: "Detroit Pistons", coordinates: [-83.0553, 42.3411], logo: "/logos/pistons.png", arenaImage: "/arenas/pistons-arena.jpg", players: [{ name: "Pistons Player 1", image: "/players/pistons-player-1.jpg" }, { name: "Pistons Player 2", image: "/players/pistons-player-2.jpg" }] },
  { name: "Indiana Pacers", coordinates: [-86.1555, 39.7639], logo: "/logos/pacers.png", arenaImage: "/arenas/pacers-arena.jpg", players: [{ name: "Pacers Player 1", image: "/players/pacers-player-1.jpg" }, { name: "Pacers Player 2", image: "/players/pacers-player-2.jpg" }] },
  { name: "Milwaukee Bucks", coordinates: [-87.9169, 43.0451], logo: "/logos/bucks.png", arenaImage: "/arenas/bucks-arena.jpg", players: [{ name: "Bucks Player 1", image: "/players/bucks-player-1.jpg" }, { name: "Bucks Player 2", image: "/players/bucks-player-2.jpg" }] },
  { name: "Atlanta Hawks", coordinates: [-84.3963, 33.7573], logo: "/logos/hawks.png", arenaImage: "/arenas/hawks-arena.jpg", players: [{ name: "Hawks Player 1", image: "/players/hawks-player-1.jpg" }, { name: "Hawks Player 2", image: "/players/hawks-player-2.jpg" }] },
  { name: "Charlotte Hornets", coordinates: [-80.8392, 35.2251], logo: "/logos/hornets.png", arenaImage: "/arenas/hornets-arena.jpg", players: [{ name: "Hornets Player 1", image: "/players/hornets-player-1.jpg" }, { name: "Hornets Player 2", image: "/players/hornets-player-2.jpg" }] },
  { name: "Miami Heat", coordinates: [-80.187, 25.7814], logo: "/logos/heat.png", arenaImage: "/arenas/heat-arena.jpg", players: [{ name: "Heat Player 1", image: "/players/heat-player-1.jpg" }, { name: "Heat Player 2", image: "/players/heat-player-2.jpg" }] },
  { name: "Orlando Magic", coordinates: [-81.3839, 28.5392], logo: "/logos/magic.png", arenaImage: "/arenas/magic-arena.jpg", players: [{ name: "Magic Player 1", image: "/players/magic-player-1.jpg" }, { name: "Magic Player 2", image: "/players/magic-player-2.jpg" }] },
  { name: "Washington Wizards", coordinates: [-77.0209, 38.8981], logo: "/logos/wizards.png", arenaImage: "/arenas/wizards-arena.jpg", players: [{ name: "Wizards Player 1", image: "/players/wizards-player-1.jpg" }, { name: "Wizards Player 2", image: "/players/wizards-player-2.jpg" }] },
];

function getPanelDetails(team) {
  return (
    TEAM_DETAILS[team.name] || {
      arena: "Home Arena",
      location: "NBA",
      code: team.name
        .split(" ")
        .slice(0, 3)
        .map((word) => word[0])
        .join("")
        .toUpperCase(),
      capacity: "TBD",
      yearBuilt: "TBD",
      color: "#22c55e",
    }
  );
}

const EMPTY_LIVE_EVENTS_STATE = {
  events: [],
  loading: false,
  loaded: false,
  error: null,
};

function formatPriceLevel(priceLevel) {
  if (!priceLevel) {
    return null;
  }

  return priceLevel
    .replace(/^PRICE_LEVEL_/, "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getOpenStatus(openNow) {
  if (openNow == null) {
    return "Hours unavailable";
  }

  return openNow ? "Open now" : "Closed";
}

function RestaurantsTab({
  restaurants,
  isLoading,
  error,
  hasCoordinates,
  targetLabel,
  onRefresh,
}) {
  return (
    <div className="px-5 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Restaurants
          </h3>
          {targetLabel ? (
            <p className="mt-1 truncate text-xs text-zinc-500">
              Near {targetLabel}
            </p>
          ) : null}
        </div>

        {hasCoordinates ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
          </button>
        ) : null}
      </div>

      {!hasCoordinates ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 text-sm text-zinc-300">
          Select an arena or enable location to find nearby restaurants.
        </div>
      ) : null}

      {hasCoordinates && isLoading ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-100">
            Finding restaurants near this arena...
          </div>
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-white/8 bg-[#232834] p-4"
            >
              <div className="h-5 w-2/3 animate-pulse rounded bg-white/8" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-white/8" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-white/8" />
              </div>
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/8" />
            </div>
          ))}
        </div>
      ) : null}

      {hasCoordinates && !isLoading && error ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          Could not load restaurants right now.
        </div>
      ) : null}

      {hasCoordinates && !isLoading && !error && !restaurants.length ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 text-sm text-zinc-300">
          No nearby restaurants found for this arena.
        </div>
      ) : null}

      {hasCoordinates && !isLoading && !error && restaurants.length ? (
        <div className="space-y-3">
          {restaurants.map((restaurant) => {
            const priceLevel = formatPriceLevel(restaurant.priceLevel);
            const openStatus = getOpenStatus(restaurant.openNow);

            return (
              <article
                key={restaurant.id}
                className="rounded-[24px] border border-white/8 bg-[#232834] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-[15px] font-semibold text-white">
                      {restaurant.name}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
                      <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                        {restaurant.rating != null
                          ? `${restaurant.rating.toFixed(1)} rating`
                          : "No rating yet"}
                      </span>
                      {restaurant.userRatingCount != null ? (
                        <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                          {restaurant.userRatingCount} reviews
                        </span>
                      ) : null}
                      {priceLevel ? (
                        <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                          {priceLevel}
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full border px-2 py-1 ${
                          restaurant.openNow === true
                            ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                            : restaurant.openNow === false
                              ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                              : "border-white/8 bg-white/5 text-zinc-300"
                        }`}
                      >
                        {openStatus}
                      </span>
                      {restaurant.distanceMiles != null ? (
                        <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1">
                          {restaurant.distanceMiles.toFixed(1)} mi
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {restaurant.address ? (
                  <p className="mt-3 text-sm leading-5 text-zinc-400">
                    {restaurant.address}
                  </p>
                ) : null}

                {restaurant.googleMapsUrl || restaurant.websiteUrl ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.googleMapsUrl ? (
                      <a
                        href={restaurant.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0b9d43] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#10ad4b]"
                      >
                        Open in Maps
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                    {restaurant.websiteUrl ? (
                      <a
                        href={restaurant.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/8 hover:text-white"
                      >
                        Website
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function ArenaMap({ onSelectedTeamChange }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("players");
  const [brokenImages, setBrokenImages] = useState({});
  const [liveEventsByTeam, setLiveEventsByTeam] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [restaurantsError, setRestaurantsError] = useState("");
  const [restaurantsLoaded, setRestaurantsLoaded] = useState(false);
  const [restaurantsTargetKey, setRestaurantsTargetKey] = useState(null);

  const panelDetails = useMemo(
    () => (selectedTeam ? getPanelDetails(selectedTeam) : null),
    [selectedTeam]
  );

  const arenaImageMissing =
    selectedTeam?.arenaImage && brokenImages[selectedTeam.arenaImage];
  const selectedTeamEventsState = selectedTeam
    ? liveEventsByTeam[selectedTeam.name] || EMPTY_LIVE_EVENTS_STATE
    : EMPTY_LIVE_EVENTS_STATE;
  const selectedArenaData =
    selectedTeam && panelDetails
      ? nbaArenas.find(
          (arena) =>
            arena.teamName === selectedTeam.name ||
            arena.arenaName === panelDetails.arena
        ) ?? null
      : null;
  const restaurantSearchTarget = selectedTeam
    ? {
        latitude: selectedArenaData?.latitude ?? selectedTeam.coordinates[1],
        longitude: selectedArenaData?.longitude ?? selectedTeam.coordinates[0],
        label: selectedArenaData?.arenaName ?? panelDetails?.arena,
        key: `arena:${selectedTeam.name}`,
      }
    : null;

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.5795, 39.8283],
      zoom: 3.2,
    });

    mapRef.current = map;

    teams.forEach((team) => {
      const markerEl = document.createElement("div");
      markerEl.className = "group h-8 w-8 cursor-pointer";

      const markerButton = document.createElement("button");
      markerButton.type = "button";
      markerButton.className =
        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white shadow-lg ring-2 ring-black/25 transition duration-150 group-hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-400";
      markerButton.setAttribute("aria-label", `Open ${team.name} details`);

      const logoEl = document.createElement("img");
      logoEl.src = team.logo;
      logoEl.alt = "";
      logoEl.className = "h-6 w-6 object-contain";
      markerButton.appendChild(logoEl);
      markerEl.appendChild(markerButton);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 22,
      }).setHTML(`
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        ">
          <img
            src="${team.logo}"
            alt="${team.name}"
            style="
              width: 50px;
              height: 50px;
              object-fit: contain;
              display: block;
            "
          />
        </div>
      `);

      markerEl.addEventListener("click", () => {
        const details = getPanelDetails(team);
        setSelectedTeam(team);
        setPanelOpen(true);
        setActiveTab("players");
        setIsExpanded(false);
        setPanelWidth(420);
        setRestaurants([]);
        setRestaurantsLoading(false);
        setRestaurantsError("");
        setRestaurantsLoaded(false);
        setRestaurantsTargetKey(null);
        onSelectedTeamChange?.({
          teamName: team.name,
          arenaName: details.arena,
        });
      });

      markerEl.addEventListener("mouseenter", () => {
        popup.setLngLat(team.coordinates).addTo(map);
      });

      markerEl.addEventListener("mouseleave", () => {
        popup.remove();
      });

      new mapboxgl.Marker(markerEl).setLngLat(team.coordinates).addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectedTeamChange]);

  useEffect(() => {
    const shouldLoadLiveEvents =
      panelOpen &&
      selectedTeam?.name &&
      (activeTab === "games" || activeTab === "tickets");

    if (!shouldLoadLiveEvents) {
      return;
    }

    const teamName = selectedTeam.name;
    const existingState = liveEventsByTeam[teamName];

    if (!existingState?.loading || existingState?.loaded) {
      return;
    }

    let cancelled = false;

    fetch(`/api/ticketmaster/team?team=${encodeURIComponent(teamName)}`)
      .then(async (response) => {
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setLiveEventsByTeam((current) => ({
            ...current,
            [teamName]: {
              events: [],
              loading: false,
              loaded: true,
              error:
                data.error || "Could not load live Ticketmaster games right now.",
            },
          }));
          return;
        }

        setLiveEventsByTeam((current) => ({
          ...current,
          [teamName]: {
            events: data.events || [],
            loading: false,
            loaded: true,
            error: null,
          },
        }));
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setLiveEventsByTeam((current) => ({
          ...current,
          [teamName]: {
            events: [],
            loading: false,
            loaded: true,
            error: "Could not load live Ticketmaster games right now.",
          },
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, liveEventsByTeam, panelOpen, selectedTeam?.name]);

  useEffect(() => {
    const shouldLoadRestaurants =
      panelOpen &&
      activeTab === "restaurants" &&
      restaurantsLoading &&
      restaurantSearchTarget?.latitude != null &&
      restaurantSearchTarget.longitude != null;

    if (!shouldLoadRestaurants) {
      return;
    }

    if (
      restaurantsLoaded &&
      restaurantsTargetKey === restaurantSearchTarget.key
    ) {
      return;
    }

    let cancelled = false;

    fetchNearbyRestaurants({
      latitude: restaurantSearchTarget.latitude,
      longitude: restaurantSearchTarget.longitude,
    })
      .then((result) => {
        if (cancelled) {
          return;
        }

        setRestaurants(result.restaurants);
        setRestaurantsLoaded(true);
        setRestaurantsTargetKey(restaurantSearchTarget.key);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setRestaurants([]);
        setRestaurantsLoaded(true);
        setRestaurantsTargetKey(restaurantSearchTarget.key);
        setRestaurantsError("Could not load restaurants right now.");
      })
      .finally(() => {
        if (!cancelled) {
          setRestaurantsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    panelOpen,
    restaurantSearchTarget?.key,
    restaurantSearchTarget?.latitude,
    restaurantSearchTarget?.longitude,
    restaurantsLoaded,
    restaurantsLoading,
    restaurantsTargetKey,
  ]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isResizing) return;

      const maxWidth = Math.min(window.innerWidth * 0.92, 620);
      const nextWidth = window.innerWidth - event.clientX;
      setPanelWidth(Math.min(Math.max(nextWidth, 360), maxWidth));
      setIsExpanded(nextWidth >= 520);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleImageError = (src) => {
    setBrokenImages((current) =>
      current[src] ? current : { ...current, [src]: true }
    );
  };

  const handleToggleExpand = () => {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);
    setPanelWidth(nextExpanded ? 560 : 420);
  };

  const handleRefreshRestaurants = () => {
    setRestaurantsLoaded(false);
    setRestaurantsTargetKey(null);
    setRestaurantsError("");
    setRestaurantsLoading(Boolean(restaurantSearchTarget));
  };

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);

    if (
      tabId === "restaurants" &&
      restaurantSearchTarget &&
      !restaurantsLoading &&
      (!restaurantsLoaded || restaurantsTargetKey !== restaurantSearchTarget.key)
    ) {
      setRestaurants([]);
      setRestaurantsError("");
      setRestaurantsLoading(true);
    }

    if (
      !selectedTeam?.name ||
      (tabId !== "games" && tabId !== "tickets") ||
      liveEventsByTeam[selectedTeam.name]
    ) {
      return;
    }

    setLiveEventsByTeam((current) => ({
      ...current,
      [selectedTeam.name]: {
        events: [],
        loading: true,
        loaded: false,
        error: null,
      },
    }));
  };

  const renderPanelContent = () => {
    if (!selectedTeam || !panelDetails) return null;

    if (activeTab === "players") {
      return <PlayersTab players={selectedTeam.players} />;
    }

    if (activeTab === "arena") {
      const [lat, lng] = [
        selectedTeam.coordinates[1],
        selectedTeam.coordinates[0],
      ];

      return (
        <ArenaDetailsTab
          team={{
            ...selectedTeam,
            capacity: panelDetails.capacity,
            yearBuilt: panelDetails.yearBuilt,
            city: panelDetails.location,
            lat,
            lng,
          }}
        />
      );
    }

    if (activeTab === "games") {
      return (
        <TicketmasterEventsTab
          title="Upcoming Games"
          emptyMessage="No upcoming Ticketmaster events found for this team."
          events={selectedTeamEventsState.events}
          isLoading={selectedTeamEventsState.loading}
          error={selectedTeamEventsState.error}
          selectedTeamName={selectedTeam.name}
          selectedArenaName={panelDetails.arena}
          buttonLabel="Details"
        />
      );
    }

    if (activeTab === "tickets") {
      return (
        <TicketmasterEventsTab
          title="Ticketmaster Tickets"
          emptyMessage="No upcoming Ticketmaster ticketed events found for this team."
          events={selectedTeamEventsState.events}
          isLoading={selectedTeamEventsState.loading}
          error={selectedTeamEventsState.error}
          selectedTeamName={selectedTeam.name}
          selectedArenaName={panelDetails.arena}
          buttonLabel="View Tickets"
          showPrice
        />
      );
    }

    return (
      <RestaurantsTab
        restaurants={restaurants}
        isLoading={restaurantsLoading}
        error={restaurantsError}
        hasCoordinates={Boolean(restaurantSearchTarget)}
        targetLabel={restaurantSearchTarget?.label}
        onRefresh={handleRefreshRestaurants}
      />
    );
  };

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden rounded-lg border border-zinc-800">
      <div ref={mapContainer} className="h-full w-full" />

      {panelOpen && selectedTeam && panelDetails ? (
        <>
          <button
            type="button"
            className="absolute inset-0 z-[65] bg-black/35 backdrop-blur-[2px]"
            aria-label="Close team details"
            onClick={() => setPanelOpen(false)}
          />

          <aside
            className="dark fixed right-0 top-0 z-[70] flex h-screen max-w-[92vw] flex-col overflow-hidden border-l border-white/10 bg-[#11151d] text-white shadow-2xl shadow-black/50"
            style={{ width: `${panelWidth}px` }}
          >
            <div
              className="absolute left-0 top-0 z-10 h-full w-2 cursor-ew-resize bg-transparent hover:bg-white/6"
              onMouseDown={(event) => {
                event.preventDefault();
                setIsResizing(true);
              }}
            />

            <div className="flex h-full flex-col overflow-hidden">
              <div className="shrink-0 pb-5 pt-4 sm:pb-6">
                <PanelHeader
                  team={{
                    name: selectedTeam.name,
                    arena: panelDetails.arena,
                    logo: selectedTeam.logo,
                    color: panelDetails.color,
                  }}
                  onClose={() => setPanelOpen(false)}
                  isExpanded={isExpanded}
                  onToggleExpand={handleToggleExpand}
                />

                {!arenaImageMissing ? (
                  <HeroBanner
                    team={{
                      bannerImage: selectedTeam.arenaImage,
                      arena: panelDetails.arena,
                      city: panelDetails.location,
                      color: panelDetails.color,
                      abbreviation: panelDetails.code,
                    }}
                    onImageError={() => handleImageError(selectedTeam.arenaImage)}
                  />
                ) : (
                  <div className="relative mx-5 mt-8 aspect-video overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top,#134e4a_0%,#0f172a_36%,#020617_100%)] sm:mx-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedTeam.logo}
                      alt=""
                      className="absolute inset-0 m-auto h-28 w-28 object-contain opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                        Home Arena
                      </p>
                      <h3 className="text-sm font-semibold text-white sm:text-base">
                        {panelDetails.arena}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-white/70" />
                        <span className="text-[11px] font-medium text-white/70 sm:text-xs">
                          {panelDetails.location}
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ background: panelDetails.color }}
                    >
                      {panelDetails.code}
                    </div>
                  </div>
                )}

                <div className="mx-5 mt-6 grid grid-cols-5 gap-2 border-b border-white/8 pb-5 sm:mx-6">
                  {PANEL_TABS.map((tab) => {
                    const Icon = tab.icon;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabSelect(tab.id)}
                        className={`inline-flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                          activeTab === tab.id
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/25"
                            : "text-zinc-400 hover:bg-white/6 hover:text-white"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 sm:px-6">
                {renderPanelContent()}
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
