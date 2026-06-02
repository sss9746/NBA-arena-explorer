# NBA Arena Explorer with Silver AI

NBA Arena Explorer is an interactive, map-driven platform for exploring NBA
arenas, discovering real games, finding nearby restaurants, and building
game-day plans. Its AI assistant, Silver, helps fans turn arena data,
Ticketmaster events, browser location, and restaurant recommendations into
practical NBA experiences, including focused 3-day road trips.

## Key Features

- Interactive Mapbox map with NBA arena markers for every team
- Arena and team exploration through a polished side panel
- Live NBA game and ticket discovery using Ticketmaster
- Nearby restaurant recommendations using Google Places
- Browser geolocation for nearby searches and trip planning
- Silver AI assistant for arena, game-day, food, and travel questions
- 3-day NBA road trip planner with a strict trip date window
- Focused single-game fallback when only one game is available
- Clear no-games state when no games exist inside the trip window
- Estimated route drawing with Start and Day markers
- Road trip summary and day-by-day itinerary cards
- Clear Road Trip action that restores the normal map state
- Friendly loading, empty, and error states across the experience

## Silver AI

Silver is an NBA arena and trip-planning assistant. It uses selected arena
context, live Ticketmaster data, nearby restaurants, and location information
to help users:

- Find NBA games near their current location
- Plan a game-day itinerary around an arena
- Discover restaurants before or after tipoff
- Create a 3-day NBA road trip from a typed city or browser location
- Generate an honest, focused plan when only one game is available

Try prompts like:

```txt
Plan me a 3-day NBA road trip from Dallas.
```

```txt
Plan a 3-day NBA road trip near me.
```

```txt
Find NBA games near me.
```

```txt
Show restaurants near this arena.
```

## Road Trip Planner

The road trip planner follows a deliberate sequence:

1. Resolve a typed starting city or use browser location.
2. Create a strict 3-day trip window.
3. Fetch nearby Ticketmaster games and keep only events inside that window.
4. Match games to NBA arenas using team, venue, and city information.
5. Build a multi-game itinerary when multiple games are available.
6. Build a focused single-game plan when exactly one game is available.
7. Show a no-games state instead of inventing matchups when no games are found.
8. Load a nearby restaurant for each available stop.
9. Calculate estimated distance and drive time between stops.
10. Draw direct map connections with a Start marker and Day markers.

The current route line is an estimate using direct map connections. A future
version can replace it with turn-by-turn driving directions.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- TypeScript and JavaScript
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) for the interactive map
- [Framer Motion](https://www.framer.com/motion/) for UI motion
- [Lucide React](https://lucide.dev/) for interface icons
- Radix UI and shadcn-style UI primitives
- Vercel-compatible Next.js route handlers for server-side API access

## APIs Used

| API | Purpose | Key handling |
| --- | --- | --- |
| Ticketmaster Discovery API | Live NBA games, events, and ticket links | Server-side only |
| Google Places API Nearby Search | Restaurants near selected arenas and game venues | Server-side only |
| OpenAI Responses API | Silver AI answers and structured trip-planning context | Server-side only |
| Mapbox GL JS | Arena map, markers, and estimated route lines | Public browser token |
| Browser Geolocation API | Nearby searches and “near me” road-trip starts | Requested in the browser |

The Ticketmaster, Google Places, and OpenAI keys are read only inside server
route handlers. Do not prefix those secrets with `NEXT_PUBLIC_`.



## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sss9746/NBA-arena-explorer.git
cd NBA-arena-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the provided template:

```bash
cp .env.example .env.local
```

Add your own API credentials to `.env.local`. Never commit that file.

### 4. Start the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

| Variable | Required | Visibility | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Browser-visible | Loads the Mapbox map and arena markers |
| `OPENAI_API_KEY` | Yes | Server-side only | Powers Silver AI through the OpenAI Responses API |
| `TICKETMASTER_API_KEY` | Yes | Server-side only | Loads live NBA events and tickets |
| `GOOGLE_PLACES_API_KEY` | Yes | Server-side only | Finds restaurants near arenas and game venues |

Use placeholder values in `.env.example`:

```env
# Browser-visible public token
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token_here

# Server-side secrets
OPENAI_API_KEY=your_openai_api_key_here
TICKETMASTER_API_KEY=your_ticketmaster_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

`NEXT_PUBLIC_MAPBOX_TOKEN` is intentionally exposed to the browser because
Mapbox GL JS runs client-side. Configure URL restrictions for that token in
Mapbox. The remaining keys must stay server-side.

## Available Scripts

```bash
npm run dev      # Start the local development server
npm run lint     # Run ESLint
npm run build    # Create an optimized production build
npm run start    # Serve the production build locally
npx tsc --noEmit # Run TypeScript checks without writing files
```

## Deployment on Vercel
https://nba-arena-explorer.vercel.app

## Project Structure

```txt
app/
  api/
    restaurants/nearby/       # Server-side Google Places route
    silver/                   # Server-side Silver AI route
    ticketmaster/             # Server-side Ticketmaster routes
  layout.tsx                  # Root layout and metadata
  page.tsx                    # Main app composition
components/
  SilverChatPanel.tsx         # Silver AI chat experience
  ui/
    ArenaMap.jsx              # Map, markers, arena side panel, and routes
    RoadTripPanel.tsx         # Road trip summary and itinerary cards
    TicketmasterEventsTab.tsx # Live game and ticket cards
data/
  arenas.ts                   # NBA arena data
  teams.ts                    # NBA team data
src/
  hooks/
    useUserLocation.ts        # Browser geolocation hook
  lib/
    distance.ts               # Distance calculation
    locationResolver.ts       # Typed city and trip-date resolution
    restaurants.ts            # Restaurant client helper
    roadTripPlanner.ts        # Road trip generation logic
    ticketmaster.ts           # Nearby Ticketmaster client helper
```

## Future Improvements

- Real driving routes using a Directions API
- Hotel recommendations near trip stops
- Budget and restaurant preference filters
- Favorite arenas and saved trips
- User accounts and shareable itineraries
- More advanced game ranking and route optimization
- Additional mobile-first interaction refinements
