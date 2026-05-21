"use client";

import { useCallback, useState } from "react";

export type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type UseUserLocationState = {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  getUserLocation: () => Promise<UserLocation | null>;
};

function getGeolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location permission was denied. Allow location access to use nearby NBA recommendations.";
  }

  if (error.code === error.TIMEOUT) {
    return "Getting your location timed out. Please try again.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Your location is unavailable right now. Please try again later.";
  }

  return "We could not get your location. Please try again.";
}

export function useUserLocation(): UseUserLocationState {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserLocation = useCallback(() => {
    setError(null);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      const unsupportedMessage =
        "Browser location is not available on this device.";
      setLocation(null);
      setError(unsupportedMessage);
      return Promise.resolve(null);
    }

    setLoading(true);

    return new Promise<UserLocation | null>((resolve) => {
      // User clicks the button, then the browser asks for location permission.
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If allowed, store latitude and longitude for Silver AI and future nearby searches.
          const nextLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocation(nextLocation);
          setError(null);
          setLoading(false);
          resolve(nextLocation);
        },
        (geolocationError) => {
          // If denied or unavailable, show a friendly error instead of storing a location.
          setLocation(null);
          setError(getGeolocationErrorMessage(geolocationError));
          setLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    location,
    loading,
    error,
    getUserLocation,
  };
}
