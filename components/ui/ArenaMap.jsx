"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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

export default function ArenaMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState("arena");

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
        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white shadow-lg ring-2 ring-black/25 transition duration-150 group-hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-400";
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
        setSelectedTeam(team);
        setPanelOpen(true);
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
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isResizing) return;

      const maxWidth = window.innerWidth * 0.9;
      const nextWidth = window.innerWidth - event.clientX;
      setPanelWidth(Math.min(Math.max(nextWidth, 320), maxWidth));
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

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden rounded-2xl border border-zinc-800">
      <div ref={mapContainer} className="h-full w-full" />

      {panelOpen && selectedTeam ? (
        <aside
          className="fixed right-0 top-0 z-[70] flex h-screen max-w-full flex-col overflow-hidden bg-white text-zinc-950 shadow-2xl"
          style={{ width: `${panelWidth}px` }}
        >
          <div
            className="absolute left-0 top-0 z-10 h-full w-2 cursor-ew-resize bg-transparent hover:bg-zinc-200/60"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsResizing(true);
            }}
          />

          <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                NBA Arena
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight">
                {selectedTeam.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-2xl leading-none text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              aria-label="Close team details"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="h-52 w-full bg-gray-200">
            <img
              src={selectedTeam.arenaImage}
              alt={`${selectedTeam.name} arena`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto border-b border-zinc-200 px-4 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("players")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "players"
                  ? "border-b-2 border-blue-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Players
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("arena")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "arena"
                  ? "border-b-2 border-blue-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Arena Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("games")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "games"
                  ? "border-b-2 border-blue-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Upcoming Games
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "tickets"
                  ? "border-b-2 border-blue-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Tickets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("restaurants")}
              className={`pb-2 text-sm font-medium ${
                activeTab === "restaurants"
                  ? "border-b-2 border-blue-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Restaurants Nearby
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "players" ? (
              selectedTeam.players?.length ? (
                <div className="flex flex-col">
                  {selectedTeam.players.map((player) => (
                    <div
                      key={player.name}
                      className="flex items-center gap-3 border-b border-zinc-200 p-3"
                    >
                      <img
                        src={player.image}
                        alt={player.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <p className="font-medium text-black">{player.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No player data available</p>
              )
            ) : null}
            {activeTab === "arena" ? <p>Arena details here</p> : null}
            {activeTab === "games" ? <p>Upcoming games here</p> : null}
            {activeTab === "tickets" ? <p>Ticket info here</p> : null}
            {activeTab === "restaurants" ? (
              <p>Restaurants near the arena here</p>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
