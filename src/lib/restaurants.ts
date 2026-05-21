type RestaurantSearchLocation = {
  latitude: number;
  longitude: number;
};

export type NearbyRestaurant = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  userRatingCount: number | null;
  priceLevel: string | null;
  googleMapsUrl: string | null;
  websiteUrl: string | null;
  openNow: boolean | null;
  types: string[];
  distanceMiles: number | null;
};

type NearbyRestaurantsResponse = {
  restaurants?: NearbyRestaurant[];
  message?: string | null;
  error?: string;
};

export type NearbyRestaurantsResult = {
  restaurants: NearbyRestaurant[];
  message: string | null;
};

export async function fetchNearbyRestaurants(
  location: RestaurantSearchLocation,
  radius = 1200
): Promise<NearbyRestaurantsResult> {
  const response = await fetch("/api/restaurants/nearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
    }),
  });

  const data = (await response.json()) as NearbyRestaurantsResponse;

  if (!response.ok) {
    throw new Error(data.error || "Could not load nearby restaurants.");
  }

  return {
    restaurants: data.restaurants ?? [],
    message: data.message ?? null,
  };
}
