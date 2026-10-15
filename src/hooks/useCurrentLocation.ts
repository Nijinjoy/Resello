import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCurrentPosition,
  LocationError,
  requestLocationPermission,
  reverseGeocode,
  type Coordinates,
  type Place,
} from '../services/location';

export type CurrentLocation =
  | { status: 'loading' }
  | { status: 'ready'; coords: Coordinates; place?: Place }
  | { status: 'denied' }
  | { status: 'error' };

export function useCurrentLocation() {
  const [location, setLocation] = useState<CurrentLocation>({
    status: 'loading',
  });
  // Ignore results from a request that a newer refresh has replaced.
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    const isCurrent = () => id === requestId.current;
    setLocation({ status: 'loading' });

    let coords: Coordinates;
    try {
      await requestLocationPermission();
      coords = await getCurrentPosition();
    } catch (error) {
      if (isCurrent()) {
        const denied =
          error instanceof LocationError && error.code === 'denied';
        setLocation({ status: denied ? 'denied' : 'error' });
      }
      return;
    }

    try {
      const place = await reverseGeocode(coords);
      if (isCurrent()) {
        setLocation({ status: 'ready', coords, place });
      }
    } catch (error) {
      // Still show the coordinates when the address lookup fails.
      console.warn('Reverse geocoding failed', error);
      if (isCurrent()) {
        setLocation({ status: 'ready', coords });
      }
    }
  }, []);

  useEffect(() => {
    const requests = requestId;
    refresh();
    // Drop any request still in flight when the screen unmounts.
    return () => {
      requests.current++;
    };
  }, [refresh]);

  return { location, refresh };
}
