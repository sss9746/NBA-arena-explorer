export type Coordinates = {
  lat: number;
  lng: number;
};

export type RoadTripStartLocation = {
  label: string;
  coordinates: Coordinates;
};

type BrowserLocation = {
  latitude: number;
  longitude: number;
};

const CITY_LOCATIONS: Record<string, RoadTripStartLocation> = {
  dallas: { label: "Dallas, TX", coordinates: { lat: 32.7767, lng: -96.797 } },
  houston: { label: "Houston, TX", coordinates: { lat: 29.7604, lng: -95.3698 } },
  "san antonio": {
    label: "San Antonio, TX",
    coordinates: { lat: 29.4241, lng: -98.4936 },
  },
  austin: { label: "Austin, TX", coordinates: { lat: 30.2672, lng: -97.7431 } },
  "oklahoma city": {
    label: "Oklahoma City, OK",
    coordinates: { lat: 35.4676, lng: -97.5164 },
  },
  "new orleans": {
    label: "New Orleans, LA",
    coordinates: { lat: 29.9511, lng: -90.0715 },
  },
  memphis: { label: "Memphis, TN", coordinates: { lat: 35.1495, lng: -90.049 } },
  atlanta: { label: "Atlanta, GA", coordinates: { lat: 33.749, lng: -84.388 } },
  denver: { label: "Denver, CO", coordinates: { lat: 39.7392, lng: -104.9903 } },
  phoenix: { label: "Phoenix, AZ", coordinates: { lat: 33.4484, lng: -112.074 } },
  "los angeles": {
    label: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  "san francisco": {
    label: "San Francisco, CA",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  sacramento: {
    label: "Sacramento, CA",
    coordinates: { lat: 38.5816, lng: -121.4944 },
  },
  "las vegas": {
    label: "Las Vegas, NV",
    coordinates: { lat: 36.1699, lng: -115.1398 },
  },
  chicago: { label: "Chicago, IL", coordinates: { lat: 41.8781, lng: -87.6298 } },
  "new york": {
    label: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  boston: { label: "Boston, MA", coordinates: { lat: 42.3601, lng: -71.0589 } },
  philadelphia: {
    label: "Philadelphia, PA",
    coordinates: { lat: 39.9526, lng: -75.1652 },
  },
  miami: { label: "Miami, FL", coordinates: { lat: 25.7617, lng: -80.1918 } },
  orlando: { label: "Orlando, FL", coordinates: { lat: 28.5383, lng: -81.3792 } },
};

const ROAD_TRIP_INTENT_REGEX =
  /\b(road trip|3[- ]day trip|three[- ]day trip|weekend trip|plan (?:me )?a trip|nba trip|basketball trip|game itinerary|travel itinerary|trip near me|trip from)\b/i;

export function isRoadTripRequest(message: string) {
  return ROAD_TRIP_INTENT_REGEX.test(message);
}

export function getRoadTripLengthDays(message: string) {
  const numericDays = message.match(/\b(\d+)[- ]day\b/i)?.[1];

  if (numericDays) {
    return Math.min(Math.max(Number.parseInt(numericDays, 10), 1), 5);
  }

  return /\bweekend\b/i.test(message) ? 3 : 3;
}

export function getRequestedTripStartDate(message: string) {
  const isoDate = message.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1];

  if (isoDate) {
    const parsed = new Date(`${isoDate}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  const namedDate = message.match(
    /\b(?:starting|start|on|from)\s+((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:,\s*20\d{2})?)/i
  )?.[1];

  if (!namedDate) {
    return undefined;
  }

  const parsed = new Date(namedDate);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getTypedStartCity(message: string) {
  return message.match(/\bfrom\s+([a-z\s.'-]+?)(?=$|[,.!?]|\s+(?:for|with|near|this|over|on|starting|start)\b)/i)?.[1]
    ?.trim()
    .toLowerCase();
}

function getBrowserStartLocation(
  userLocation?: BrowserLocation | null
): RoadTripStartLocation | null {
  if (!userLocation) {
    return null;
  }

  return {
    label: "Your location",
    coordinates: {
      lat: userLocation.latitude,
      lng: userLocation.longitude,
    },
  };
}

export function resolveRoadTripStartLocation(
  message: string,
  userLocation?: BrowserLocation | null
) {
  const typedCity = getTypedStartCity(message);

  if (typedCity && CITY_LOCATIONS[typedCity]) {
    return CITY_LOCATIONS[typedCity];
  }

  return getBrowserStartLocation(userLocation);
}

export function hasUnresolvedTypedStartCity(message: string) {
  const typedCity = getTypedStartCity(message);
  return Boolean(typedCity && !CITY_LOCATIONS[typedCity]);
}

export function shouldRequestBrowserLocationForRoadTrip(message: string) {
  return /\bnear me\b/i.test(message) || !getTypedStartCity(message);
}
