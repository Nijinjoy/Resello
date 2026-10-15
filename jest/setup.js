/* eslint-env jest */
jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(),
  isVisible: jest.fn().mockReturnValue(false),
  useHideAnimation: jest.fn().mockReturnValue({
    container: {},
    logo: { source: 0 },
    brand: { source: 0 },
  }),
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn().mockResolvedValue({
    assets: [{ uri: 'file:///camera-1.jpg' }],
  }),
  launchImageLibrary: jest.fn().mockResolvedValue({
    assets: [
      { uri: 'file:///library-1.jpg' },
      { uri: 'file:///library-2.jpg' },
    ],
  }),
}));

jest.mock('@react-native-community/geolocation', () => ({
  requestAuthorization: jest.fn(success => success()),
  getCurrentPosition: jest.fn(success =>
    success({ coords: { latitude: 25.1124, longitude: 55.2004 } }),
  ),
}));

const geocodeResponse = {
  json: () =>
    Promise.resolve({
      status: 'OK',
      results: [
        {
          formatted_address: 'Al Barsha 1 - Dubai - United Arab Emirates',
          address_components: [
            {
              long_name: 'Al Barsha 1',
              short_name: 'Al Barsha 1',
              types: ['sublocality_level_1', 'sublocality', 'political'],
            },
            {
              long_name: 'Dubai',
              short_name: 'Dubai',
              types: ['locality', 'political'],
            },
          ],
        },
      ],
    }),
};

const placesAutocompleteResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      suggestions: [
        {
          placePrediction: {
            placeId: 'marina-id',
            structuredFormat: {
              mainText: { text: 'Dubai Marina' },
              secondaryText: { text: 'Dubai - United Arab Emirates' },
            },
          },
        },
      ],
    }),
};

const placeDetailsResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      displayName: { text: 'Dubai Marina' },
      formattedAddress: 'Dubai Marina - Dubai - United Arab Emirates',
      location: { latitude: 25.0805, longitude: 55.1403 },
    }),
};

// Routes Google Maps requests to canned responses.
global.fetch = jest.fn(url =>
  Promise.resolve(
    url.includes('places:autocomplete')
      ? placesAutocompleteResponse
      : url.includes('/v1/places/')
      ? placeDetailsResponse
      : geocodeResponse,
  ),
);

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
