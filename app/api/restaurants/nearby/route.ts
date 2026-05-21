import { NextResponse } from "next/server";
import { calculateDistanceMiles } from "@/src/lib/distance";
import type { NearbyRestaurant } from "@/src/lib/restaurants";

const GOOGLE_PLACES_NEARBY_URL =
  "https://places.googleapis.com/v1/places:searchNearby";
const DEFAULT_RADIUS_METERS = 1200;
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.currentOpeningHours",
  "places.types",
].join(",");

type NearbyRestaurantsRequestBody = {
  latitude?: number;
  longitude?: number;
  radius?: number;
};

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  googleMapsUri?: string;
  websiteUri?: string;
  currentOpeningHours?: {
    openNow?: boolean;
  };
  types?: string[];
};

type GooglePlacesResponse = {
  places?: GooglePlace[];
  error?: {
    message?: string;
    status?: string;
  };
};

function normalizePlace(
  place: GooglePlace,
  originLatitude: number,
  originLongitude: number
): NearbyRestaurant {
  const latitude =
    typeof place.location?.latitude === "number" ? place.location.latitude : null;
  const longitude =
    typeof place.location?.longitude === "number"
      ? place.location.longitude
      : null;
  const distanceMiles =
    latitude != null && longitude != null
      ? calculateDistanceMiles(originLatitude, originLongitude, latitude, longitude)
      : null;

  return {
    id:
      place.id ??
      `${place.displayName?.text ?? "restaurant"}-${place.formattedAddress ?? "unknown"}`,
    name: place.displayName?.text ?? "Unnamed restaurant",
    address: place.formattedAddress ?? null,
    latitude,
    longitude,
    rating: typeof place.rating === "number" ? place.rating : null,
    userRatingCount:
      typeof place.userRatingCount === "number" ? place.userRatingCount : null,
    priceLevel: place.priceLevel ?? null,
    googleMapsUrl: place.googleMapsUri ?? null,
    websiteUrl: place.websiteUri ?? null,
    openNow:
      typeof place.currentOpeningHours?.openNow === "boolean"
        ? place.currentOpeningHours.openNow
        : null,
    types: place.types ?? [],
    distanceMiles,
  };
}

function sortRestaurants(restaurants: NearbyRestaurant[]) {
  return [...restaurants].sort((a, b) => {
    if (a.openNow !== b.openNow) {
      if (a.openNow === true) {
        return -1;
      }

      if (b.openNow === true) {
        return 1;
      }
    }

    const aRating = a.rating ?? -1;
    const bRating = b.rating ?? -1;

    if (aRating !== bRating) {
      return bRating - aRating;
    }

    const aDistance = a.distanceMiles ?? Number.POSITIVE_INFINITY;
    const bDistance = b.distanceMiles ?? Number.POSITIVE_INFINITY;

    return aDistance - bDistance;
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_PLACES_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as NearbyRestaurantsRequestBody;
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const requestedRadius = Number(body.radius);
    const radius = Number.isFinite(requestedRadius)
      ? requestedRadius
      : DEFAULT_RADIUS_METERS;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { error: "latitude and longitude are required." },
        { status: 400 }
      );
    }

    const response = await fetch(GOOGLE_PLACES_NEARBY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes: ["restaurant"],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude,
            },
            radius,
          },
        },
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as GooglePlacesResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            payload.error?.message ??
            `Google Places request failed (${response.status}).`,
        },
        { status: 502 }
      );
    }

    const restaurants = sortRestaurants(
      (payload.places ?? []).map((place) =>
        normalizePlace(place, latitude, longitude)
      )
    );

    return NextResponse.json({
      restaurants,
      message: restaurants.length ? null : "No restaurants found.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not load nearby restaurants from Google Places.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
