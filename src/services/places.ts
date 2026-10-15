import { GOOGLE_MAPS_API_KEY } from '@env';
import type { Coordinates } from './location';

// Google Places API (New):
// https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
const PLACES_URL = 'https://places.googleapis.com/v1';
// Listings are UAE-only for now.
const REGION_CODES = ['ae'];
const BIAS_RADIUS_METERS = 30000;

export type PlaceSuggestion = {
  placeId: string;
  mainText: string;
  secondaryText?: string;
};

export type PickedPlace = {
  name: string;
  address: string;
  coords: Coordinates;
};

// Groups an autocomplete session with the details call that ends it, so
// Google bills them together. Start a new one each time the picker opens.
export function newSessionToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = Math.floor(Math.random() * 16);
    return (char === 'x' ? random : (random % 4) + 8).toString(16);
  });
}

function apiKey() {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set');
  }
  return GOOGLE_MAPS_API_KEY;
}

async function parse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? `Places request failed`);
  }
  return data as T;
}

type AutocompleteResponse = {
  suggestions?: {
    placePrediction?: {
      placeId: string;
      structuredFormat?: {
        mainText?: { text: string };
        secondaryText?: { text: string };
      };
      text?: { text: string };
    };
  }[];
};

export async function searchPlaces(
  input: string,
  sessionToken: string,
  near?: Coordinates,
): Promise<PlaceSuggestion[]> {
  const response = await fetch(`${PLACES_URL}/places:autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey(),
    },
    body: JSON.stringify({
      input,
      sessionToken,
      includedRegionCodes: REGION_CODES,
      ...(near && {
        locationBias: {
          circle: { center: near, radius: BIAS_RADIUS_METERS },
        },
      }),
    }),
  });
  const data = await parse<AutocompleteResponse>(response);
  return (data.suggestions ?? []).flatMap(({ placePrediction: p }) =>
    p
      ? [
          {
            placeId: p.placeId,
            mainText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? '',
            secondaryText: p.structuredFormat?.secondaryText?.text,
          },
        ]
      : [],
  );
}

type DetailsResponse = {
  displayName?: { text: string };
  formattedAddress?: string;
  location: Coordinates;
};

export async function getPlace(
  placeId: string,
  sessionToken: string,
): Promise<PickedPlace> {
  const response = await fetch(
    `${PLACES_URL}/places/${encodeURIComponent(
      placeId,
    )}?sessionToken=${sessionToken}`,
    {
      headers: {
        'X-Goog-Api-Key': apiKey(),
        'X-Goog-FieldMask': 'displayName,formattedAddress,location',
      },
    },
  );
  const data = await parse<DetailsResponse>(response);
  return {
    name: data.displayName?.text ?? data.formattedAddress ?? 'Selected place',
    address: data.formattedAddress ?? '',
    coords: data.location,
  };
}
