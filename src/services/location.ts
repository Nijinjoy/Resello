import Geolocation, {
  type GeolocationError,
} from '@react-native-community/geolocation';
import { GOOGLE_MAPS_API_KEY } from '@env';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Place = {
  // Short label such as "Al Barsha, Dubai".
  name: string;
  // Full street address from Google.
  address: string;
};

export type LocationErrorCode = 'denied' | 'unavailable' | 'geocode';

export class LocationError extends Error {
  constructor(public code: LocationErrorCode, message: string) {
    super(message);
    this.name = 'LocationError';
  }
}

// Matches GeolocationError.PERMISSION_DENIED.
const PERMISSION_DENIED = 1;

const toLocationError = (error: GeolocationError) =>
  new LocationError(
    error.code === PERMISSION_DENIED ? 'denied' : 'unavailable',
    error.message,
  );

export function requestLocationPermission(): Promise<void> {
  return new Promise((resolve, reject) => {
    Geolocation.requestAuthorization(resolve, error =>
      reject(toLocationError(error)),
    );
  });
}

export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      error => reject(toLocationError(error)),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeocodeResponse = {
  status: string;
  error_message?: string;
  results: {
    formatted_address: string;
    address_components: AddressComponent[];
  }[];
};

const AREA_TYPES = ['neighborhood', 'sublocality_level_1', 'sublocality'];
const CITY_TYPES = ['locality', 'administrative_area_level_1'];

function findComponent(components: AddressComponent[], types: string[]) {
  for (const type of types) {
    const match = components.find(c => c.types.includes(type));
    if (match) {
      return match.long_name;
    }
  }
  return undefined;
}

// Google Geocoding API: https://developers.google.com/maps/documentation/geocoding
export async function reverseGeocode({
  latitude,
  longitude,
}: Coordinates): Promise<Place> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new LocationError('geocode', 'GOOGLE_MAPS_API_KEY is not set');
  }
  const url =
    'https://maps.googleapis.com/maps/api/geocode/json' +
    `?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(url);
  const data: GeocodeResponse = await response.json();
  if (data.status !== 'OK' || data.results.length === 0) {
    throw new LocationError(
      'geocode',
      data.error_message ?? `Geocoding failed: ${data.status}`,
    );
  }

  const [best] = data.results;
  const components = best.address_components;
  const area = findComponent(components, AREA_TYPES);
  const city = findComponent(components, CITY_TYPES);
  const name =
    [area, city].filter(Boolean).join(', ') ||
    best.formatted_address.split(',')[0];
  return { name, address: best.formatted_address };
}
