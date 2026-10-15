/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BootSplash from 'react-native-bootsplash';
import { Alert, StyleSheet } from 'react-native';
import App from '../App';

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(async () => {
  await ReactTestRenderer.act(() => renderer?.unmount());
  renderer = undefined;
  jest.useRealTimers();
});

const hasText = (text: string) =>
  renderer!.root.findAllByProps({ children: text }).length > 0;

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
});

const pressButton = async (label: string) => {
  const button = renderer!.root
    .findAll(node => node.props.accessibilityRole === 'button')
    .find(node => node.findAllByProps({ children: label }).length > 0)!;
  await ReactTestRenderer.act(async () => {
    button.props.onPress();
    jest.advanceTimersByTime(1000);
  });
};

const showWelcome = async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(2000);
  });
};

test('moves from Splash to Welcome, then to Login', async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(BootSplash.hide).toHaveBeenCalledWith({ fade: true });
  expect(hasText('Resell. Rediscover.')).toBe(true);
  expect(hasText('Continue')).toBe(false);

  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(2000);
  });

  expect(hasText('Resell. Rediscover.')).toBe(false);
  expect(hasText('Discover great deals')).toBe(true);
  expect(hasText('I already have an account')).toBe(true);

  await pressButton('Get started');
  expect(hasText('Log in with your phone')).toBe(true);
});

const showLogin = async () => {
  await showWelcome();
  await pressButton('Get started');
};

const typeInto = async (label: string, text: string) => {
  const input = renderer!.root.find(
    node => node.props.accessibilityLabel === label && node.props.onChangeText,
  );
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText(text);
  });
};

test('Login rejects an invalid mobile number', async () => {
  await showLogin();
  await typeInto('Mobile number', '4123');
  await pressButton('Continue');
  expect(hasText('Enter a valid mobile number for the selected country.')).toBe(
    true,
  );
  expect(hasText('Log in with your phone')).toBe(true);
});

test('Login with a valid UAE mobile number opens the OTP screen', async () => {
  await showLogin();
  await typeInto('Mobile number', '050 123 4567');
  const input = renderer!.root.find(
    node =>
      node.props.accessibilityLabel === 'Mobile number' &&
      node.props.onChangeText,
  );
  expect(input.props.value).toBe('50 123 4567');
  await pressButton('Continue');
  expect(hasText('Enter verification code')).toBe(true);
  expect(hasText('We sent a 6-digit code to +971 50 123 4567')).toBe(true);
});

const showOtp = async () => {
  await showLogin();
  await typeInto('Mobile number', '501234567');
  await pressButton('Continue');
};

test('OTP waits for Verify instead of submitting on the last digit', async () => {
  await showOtp();
  await typeInto('Verification code', '12a3456789');
  expect(hasText('Enter verification code')).toBe(true);
  await pressButton('Verify');
  expect(hasText('Home')).toBe(true);
  expect(hasText('Enter verification code')).toBe(false);
});

const pressLabel = async (label: string) => {
  const button = renderer!.root.find(
    node => node.props.accessibilityLabel === label && node.props.onPress,
  );
  await ReactTestRenderer.act(async () => {
    button.props.onPress();
    jest.advanceTimersByTime(1000);
  });
};

test('Dashboard shows 5 bottom tabs and switches between them', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const findTab = (name: string) =>
    renderer!.root.find(
      node => node.props.testID === `tab-${name}` && node.props.onPress,
    );
  const tabs = ['Home', 'Explore', 'Sell', 'Chats', 'Cart'].map(findTab);
  expect(tabs).toHaveLength(5);
  expect(
    renderer!.root.findAll(node => node.props.testID === 'tab-Profile'),
  ).toHaveLength(0);
  const isSelected = (name: string) =>
    renderer!.root.findAll(
      node =>
        node.props.testID === `tab-${name}` && node.props['aria-selected'],
    ).length > 0;
  expect(isSelected('Home')).toBe(true);

  await ReactTestRenderer.act(async () => {
    findTab('Cart').props.onPress({ preventDefault() {} });
  });
  expect(isSelected('Cart')).toBe(true);
  expect(isSelected('Home')).toBe(false);
});

test('Drawer shows the current location from Google geocoding', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('latlng=25.1124,55.2004'),
  );
  expect(hasText('Al Barsha 1, Dubai')).toBe(false);

  await pressLabel('Open profile menu');
  expect(hasText('Your location')).toBe(true);
  expect(hasText('Al Barsha 1, Dubai')).toBe(true);
});

test('Drawer lets you choose an area when location is denied', async () => {
  const Geolocation = require('@react-native-community/geolocation');
  Geolocation.requestAuthorization.mockImplementationOnce(
    (_: unknown, error: (e: object) => void) =>
      error({ code: 1, message: 'denied' }),
  );
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await pressLabel('Open profile menu');
  expect(hasText('Location access is off')).toBe(true);
  expect(hasText('Choose your area')).toBe(true);

  await pressLabel('Location access is off: Choose your area');
  await typeInto('Search places', 'marina');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(300);
  });
  await pressLabel('Dubai Marina, Dubai - United Arab Emirates');
  expect(hasText('Dubai Marina')).toBe(true);
  expect(hasText('Choose your area')).toBe(false);

  // The chosen area is kept after closing and reopening the drawer.
  await pressLabel('Close menu');
  await pressLabel('Open profile menu');
  expect(hasText('Dubai Marina')).toBe(true);
});

test('Chats tab lists conversations with search and filters', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .find(node => node.props.testID === 'tab-Chats' && node.props.onPress)
      .props.onPress({ preventDefault() {} });
  });
  expect(hasText('Aisha Rahman')).toBe(true);
  expect(hasText('iPhone 13 Pro, 256GB · AED 2,100')).toBe(true);
  expect(hasText('Omar Al Hashimi')).toBe(true);

  await pressButton('Selling');
  expect(hasText('Omar Al Hashimi')).toBe(true);
  expect(hasText('Aisha Rahman')).toBe(false);

  await pressButton('All');
  await typeInto('Search chats', 'playstation');
  expect(hasText('Priya Nair')).toBe(true);
  expect(hasText('Aisha Rahman')).toBe(false);

  await typeInto('Search chats', 'zzz');
  expect(hasText('No chats here yet')).toBe(true);
});

test('Sell tab validates and posts a listing', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .find(node => node.props.testID === 'tab-Sell' && node.props.onPress)
      .props.onPress({ preventDefault() {} });
  });
  expect(hasText('Add photos')).toBe(true);

  await pressButton('Post listing');
  expect(hasText('Add at least one photo.')).toBe(true);
  expect(hasText('Enter a title of at least 3 characters.')).toBe(true);
  expect(hasText('Choose a category.')).toBe(true);
  expect(hasText('Choose the condition.')).toBe(true);
  expect(hasText('Enter a price above 0.')).toBe(true);

  const alertSpy = jest.spyOn(Alert, 'alert');
  const choose = async (option: string) => {
    await pressLabel('Add photos');
    const buttons = alertSpy.mock.lastCall![2]!;
    await ReactTestRenderer.act(async () => {
      buttons.find(button => button.text === option)!.onPress!();
    });
  };
  await choose('Choose from library');
  await choose('Take photo');
  expect(hasText('3/6')).toBe(true);
  expect(
    renderer!.root.findAll(
      node => node.props.accessibilityLabel === 'Cover photo',
    ).length,
  ).toBeGreaterThan(0);
  await pressLabel('Remove photo 1');
  expect(hasText('2/6')).toBe(true);
  alertSpy.mockRestore();

  expect(hasText('Al Barsha 1, Dubai')).toBe(true);
  await pressLabel('Pickup location: Al Barsha 1, Dubai');
  await typeInto('Search places', 'marina');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(300);
  });
  await pressLabel('Dubai Marina, Dubai - United Arab Emirates');
  expect(
    renderer!.root.findAll(
      node => node.props.accessibilityLabel === 'Search places',
    ),
  ).toHaveLength(0);
  expect(hasText('Dubai Marina - Dubai - United Arab Emirates')).toBe(true);
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/v1/places/marina-id'),
    expect.anything(),
  );

  await typeInto('Title', 'Trek road bike');
  // Scoped to the form's chips: Home also has "Bikes" and "Like new" buttons.
  const pressChip = async (label: string) => {
    const chip = renderer!.root
      .findAll(
        node =>
          node.props.accessibilityRole === 'button' &&
          node.props.accessibilityState &&
          node.props.onPress,
      )
      .find(node => node.findAllByProps({ children: label }).length > 0)!;
    await ReactTestRenderer.act(async () => {
      chip.props.onPress();
    });
  };
  await pressChip('Bikes');
  await pressChip('Like new');
  await typeInto('Price', 'AED 1,800');
  await pressButton('Post listing');
  expect(hasText('Your listing is live')).toBe(true);
  expect(hasText('Trek road bike · AED 1,800')).toBe(true);

  await pressButton('Sell another item');
  expect(hasText('Post listing')).toBe(true);
});

test('Cart tab groups by seller, totals, and undoes removal', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .find(node => node.props.testID === 'tab-Cart' && node.props.onPress)
      .props.onPress({ preventDefault() {} });
  });
  expect(hasText('Pickup in Al Barsha')).toBe(true);
  expect(hasText("1 item sold out and isn't included in your total.")).toBe(
    true,
  );
  // 2,100 + 1,450 + 1,800 = 5,350, plus 2.5% buyer protection (134)
  // and the AED 10 platform fee.
  expect(hasText('AED 5,350')).toBe(true);
  expect(hasText('AED 134')).toBe(true);
  expect(hasText('AED 10')).toBe(true);
  expect(hasText('AED 5,494')).toBe(true);
  expect(hasText('Checkout (3)')).toBe(true);

  await pressLabel('Remove iPhone 13 Pro, 256GB');
  expect(hasText('Pickup in Al Barsha')).toBe(false);
  expect(hasText('Removed iPhone 13 Pro, 256GB')).toBe(true);
  await pressButton('Undo');
  expect(hasText('Pickup in Al Barsha')).toBe(true);

  await pressLabel('Remove sold out items');
  expect(hasText('Sold out')).toBe(false);
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(4000);
  });
  expect(hasText('Undo')).toBe(false);

  for (const title of [
    'iPhone 13 Pro, 256GB',
    'PlayStation 5 + 2 controllers',
    'Trek road bike, size M',
  ]) {
    await pressLabel(`Remove ${title}`);
  }
  expect(hasText('Your cart is empty')).toBe(true);
  expect(hasText('Pay with protection')).toBe(true);
  await pressButton('Start exploring');
  expect(
    renderer!.root.findAll(
      node =>
        node.props.testID === 'tab-Explore' && node.props['aria-selected'],
    ).length,
  ).toBeGreaterThan(0);
});

test('Every tab has the same header with no subtitle', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const openTab = (name: string) =>
    ReactTestRenderer.act(async () => {
      renderer!.root
        .find(node => node.props.testID === `tab-${name}` && node.props.onPress)
        .props.onPress({ preventDefault() {} });
    });
  const headerButtons = (label: string) =>
    renderer!.root.findAll(
      node => node.props.accessibilityLabel === label && node.props.onPress,
    ).length;

  for (const name of ['Explore', 'Sell', 'Chats', 'Cart']) {
    await openTab(name);
  }
  expect(hasText('Discover pre-loved deals')).toBe(false);

  // One menu, favorites and notifications button per visited tab.
  expect(headerButtons('Open profile menu')).toBe(5);
  expect(headerButtons('Favorites')).toBe(5);
  expect(headerButtons('Notifications, 3 new')).toBe(5);

  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel === 'Notifications, 3 new' &&
          node.props.onPress,
      )[0]
      .props.onPress();
  });
  expect(hasText('Unread (3)')).toBe(true);
});

test('Home shows categories, nearby and fresh listings', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const isTabSelected = (name: string) =>
    renderer!.root.findAll(
      node =>
        node.props.testID === `tab-${name}` && node.props['aria-selected'],
    ).length > 0;

  expect(hasText('Categories')).toBe(true);
  expect(hasText('Electronics')).toBe(true);
  expect(hasText('Near you')).toBe(true);
  expect(hasText('Fresh finds')).toBe(true);
  // Nearby is sorted by distance and only lists items within 5 km.
  expect(hasText('Al Barsha · 800 m · 12m ago')).toBe(true);
  expect(hasText('Mirdif · 18.0 km · Yesterday')).toBe(true);

  const saveButtons = renderer!.root.findAll(
    node =>
      node.props.accessibilityLabel ===
        'Save MacBook Air M2, 13" to favorites' && node.props.onPress,
  );
  // The same listing appears in Near you and Fresh finds.
  expect(saveButtons).toHaveLength(2);
  await ReactTestRenderer.act(async () => {
    saveButtons[0].props.onPress();
  });
  expect(
    renderer!.root.findAll(
      node =>
        node.props.accessibilityLabel ===
          'Remove MacBook Air M2, 13" from favorites' && node.props.onPress,
    ),
  ).toHaveLength(2);
  // The header heart counts saved listings.
  expect(
    renderer!.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Favorites, 1 saved' &&
        node.props.onPress,
    ),
  ).toHaveLength(1);

  // A card opens its details, which share the saved state.
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel ===
            'Kids balance bike, AED 120, Good, Al Barsha' && node.props.onPress,
      )[0]
      .props.onPress();
  });
  expect(hasText('Description')).toBe(true);
  expect(
    renderer!.root.findAll(
      node => node.props.accessibilityLabel === 'Photo 1 of 3',
    ).length,
  ).toBeGreaterThan(0);
  await pressButton('Add to cart');
  expect(hasText('In cart · View')).toBe(true);
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel ===
            'Save Kids balance bike to favorites' && node.props.onPress,
      )
      .at(-1)!
      .props.onPress();
  });
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node => node.props.accessibilityLabel === 'Back' && node.props.onPress,
      )
      .at(-1)!
      .props.onPress();
  });
  expect(hasText('In cart · View')).toBe(false);
  expect(
    renderer!.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Favorites, 2 saved' &&
        node.props.onPress,
    ),
  ).toHaveLength(1);

  await pressButton('Start selling');
  expect(isTabSelected('Sell')).toBe(true);
});

test('Listing details open a chat with the seller', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  // The card is listed twice on Home, so press the first match.
  const pressFirst = async (label: string) =>
    ReactTestRenderer.act(async () => {
      renderer!.root
        .findAll(
          node => node.props.accessibilityLabel === label && node.props.onPress,
        )[0]
        .props.onPress();
    });

  await pressFirst('Kids balance bike, AED 120, Good, Al Barsha');
  await pressLabel('Chat with Hassan Ali');
  expect(hasText('Ask Hassan about this item')).toBe(true);

  await pressButton('Is this still available?');
  expect(hasText('Ask Hassan about this item')).toBe(false);
  expect(hasText('Is this still available?')).toBe(true);
});

test('Header shows a divider once content scrolls under it', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const header = () =>
    renderer!.root.find(
      node => node.props.testID === 'tab-header' && node.props.style,
    );
  const borderColor = () =>
    StyleSheet.flatten(header().props.style).borderBottomColor;
  const homeList = renderer!.root.find(
    node => node.props.numColumns === 2 && node.props.onScroll,
  );
  const scrollTo = (y: number) =>
    ReactTestRenderer.act(async () => {
      homeList.props.onScroll({ nativeEvent: { contentOffset: { x: 0, y } } });
    });

  expect(borderColor()).toBe('transparent');
  await scrollTo(120);
  expect(borderColor()).not.toBe('transparent');
  await scrollTo(0);
  expect(borderColor()).toBe('transparent');
});

test('Home banners advance on their own and loop', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const bannerLabel = () =>
    renderer!.root.find(
      node =>
        typeof node.props.accessibilityLabel === 'string' &&
        node.props.accessibilityLabel.startsWith('Banner ') &&
        node.props.accessibilityRole === 'adjustable',
    ).props.accessibilityLabel;

  expect(hasText('Sell in under a minute')).toBe(true);
  expect(hasText("Full refund if it's not as described")).toBe(true);
  const start = Number(bannerLabel().match(/Banner (\d)/)![1]);
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(4000);
  });
  expect(bannerLabel()).toBe(`Banner ${(start % 3) + 1} of 3`);
  for (let i = 0; i < 2; i++) {
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(4000);
    });
  }
  // Three steps later it has looped back around.
  expect(bannerLabel()).toBe(`Banner ${start} of 3`);

  await pressButton('How it works');
  expect(hasText('Buyer protection')).toBe(true);
});

test('Explore searches, filters by category and applies filters', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const isTabSelected = (name: string) =>
    renderer!.root.findAll(
      node =>
        node.props.testID === `tab-${name}` && node.props['aria-selected'],
    ).length > 0;

  // A Home category opens Explore filtered to it.
  await pressButton('Gaming');
  expect(isTabSelected('Explore')).toBe(true);
  expect(hasText('1 result')).toBe(true);
  expect(hasText('Nintendo Switch OLED')).toBe(true);

  await pressLabel('All categories');
  expect(hasText('8 results')).toBe(true);

  await typeInto('Search listings', 'sony');
  expect(hasText('1 result')).toBe(true);
  await typeInto('Search listings', 'zzz');
  expect(hasText('No items match')).toBe(true);
  await pressButton('Clear all');
  expect(hasText('8 results')).toBe(true);

  await pressLabel('Filters');
  await pressLabel('Like new condition');
  await pressLabel('Within 5 km');
  expect(hasText('Show 2 results')).toBe(true);
  await pressLabel('Sort by Price: low to high');
  await pressButton('Show 2 results');
  expect(hasText('2 results')).toBe(true);
  expect(hasText('Price: low to high')).toBe(true);
  expect(
    renderer!.root.findAll(
      node => node.props.accessibilityLabel === 'Filters, 2 active',
    ).length,
  ).toBeGreaterThan(0);
});

test('Notifications screen groups, filters and opens targets', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  const bellLabels = () =>
    renderer!.root
      .findAll(
        node =>
          typeof node.props.accessibilityLabel === 'string' &&
          node.props.accessibilityLabel.startsWith('Notifications') &&
          node.props.onPress,
      )
      .map(node => node.props.accessibilityLabel);
  const isTabSelected = (name: string) =>
    renderer!.root.findAll(
      node =>
        node.props.testID === `tab-${name}` && node.props['aria-selected'],
    ).length > 0;

  await pressLabel('Notifications, 3 new');
  expect(hasText('Today')).toBe(true);
  expect(hasText('Yesterday')).toBe(true);
  expect(hasText('Earlier')).toBe(true);
  expect(hasText('Unread (3)')).toBe(true);

  await pressButton('Unread (3)');
  expect(hasText('New offer on IKEA 3-seat sofa')).toBe(true);
  expect(hasText('Item sold')).toBe(false);
  await pressButton('All');

  // Opening a message marks it read and switches to the Chats tab.
  await pressButton('Aisha Rahman sent a message');
  expect(isTabSelected('Chats')).toBe(true);
  expect(bellLabels()).toContain('Notifications, 2 new');
  // It went back to the existing Dashboard instead of stacking a new one.
  expect(
    renderer!.root.findAll(node => node.props.testID === 'tab-Home').length,
  ).toBeGreaterThan(0);
  expect(hasText('Today')).toBe(false);

  // Home and Chats are both mounted now, each with a bell.
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel === 'Notifications, 2 new' &&
          node.props.onPress,
      )[0]
      .props.onPress();
  });
  // The opened notification is no longer unread.
  await pressButton('Unread (2)');
  expect(hasText('New offer on IKEA 3-seat sofa')).toBe(true);
  expect(hasText('Aisha Rahman sent a message')).toBe(false);
});

test('Drawer Notifications item opens the Notifications screen', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await pressLabel('Open profile menu');
  await pressButton('Notifications');
  expect(hasText('Unread (3)')).toBe(true);
});

test('Profile opens in a drawer from the menu button', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  expect(hasText('Muhammed Shamsudeen')).toBe(false);

  await pressLabel('Open profile menu');
  expect(hasText('Muhammed Shamsudeen')).toBe(true);
  expect(hasText('+971 50 123 4567')).toBe(true);
  expect(hasText('My listings')).toBe(true);

  await pressLabel('Close menu');
  expect(hasText('Muhammed Shamsudeen')).toBe(false);

  await pressLabel('Open profile menu');
  await pressButton('Sold');
  expect(hasText('Muhammed Shamsudeen')).toBe(false);
  expect(hasText('Items sold')).toBe(true);
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .find(node => node.props.testID === 'tab-Home' && node.props.onPress)
      .props.onPress({ preventDefault() {} });
  });

  await pressLabel('Open profile menu');
  await pressLabel('Edit profile');
  expect(hasText('This screen is coming soon.')).toBe(true);
  expect(hasText('Edit profile')).toBe(true);
});

test('My listings shows active and sold items', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await pressLabel('Open profile menu');
  await pressButton('My listings');

  expect(hasText('iPhone 12, 128GB')).toBe(true);
  expect(hasText('Active (3)')).toBe(true);
  expect(hasText('Bomber jacket, size L')).toBe(false);

  await pressButton('Sold (3)');
  expect(hasText('Bomber jacket, size L')).toBe(true);
  expect(hasText('AED 600')).toBe(true);

  // Relisting moves an item back to Active.
  await pressButton('Relist');
  expect(hasText('Sold (2)')).toBe(true);
  expect(hasText('Active (4)')).toBe(true);
});

test('Favorites lists saved items and empties when unsaved', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');

  await pressLabel('Favorites');
  expect(hasText('No favorites yet')).toBe(true);
  await pressButton('Explore items');

  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel ===
            'Save Sony WH-1000XM5 to favorites' && node.props.onPress,
      )[0]
      .props.onPress();
  });
  // Home and Explore are both mounted, each with a header heart.
  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel === 'Favorites, 1 saved' &&
          node.props.onPress,
      )
      .at(-1)!
      .props.onPress();
  });
  expect(hasText('1 saved item')).toBe(true);
  expect(hasText('Sony WH-1000XM5')).toBe(true);

  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(
        node =>
          node.props.accessibilityLabel ===
            'Remove Sony WH-1000XM5 from favorites' && node.props.onPress,
      )
      .at(-1)!
      .props.onPress();
  });
  expect(hasText('No favorites yet')).toBe(true);
});

test('Purchases and Sold list orders from the drawer', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');

  await pressLabel('Open profile menu');
  await pressButton('Purchases');
  expect(hasText('5 orders · AED 1,650 spent')).toBe(true);
  expect(hasText('Air Jordan 1, size 43')).toBe(true);
  await pressButton('In progress');
  expect(hasText('Air Jordan 1, size 43')).toBe(false);
  expect(hasText('Ready for pickup')).toBe(true);
});

test('Sold shows earnings and payouts', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');

  await pressLabel('Open profile menu');
  await pressButton('Sold');
  expect(hasText('AED 600')).toBe(true);
  expect(hasText('Payout pending')).toBe(true);
  expect(hasText('Buyer: Lina Haddad')).toBe(true);
});

test('Terms & privacy switches between the two documents', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');

  await pressLabel('Open profile menu');
  await pressButton('Terms & privacy');
  expect(hasText('1. About these terms')).toBe(true);
  expect(hasText('5. Buyer protection')).toBe(true);

  await ReactTestRenderer.act(async () => {
    renderer!.root
      .findAll(node => node.props.accessibilityRole === 'tab')
      .find(node => node.findAllByProps({ children: 'Privacy policy' }).length)!
      .props.onPress();
  });
  expect(hasText('1. About these terms')).toBe(false);
  expect(hasText('2. What we collect')).toBe(true);
  expect(hasText('support@resello.app')).toBe(true);
});

test('Help & support filters and expands FAQs', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');

  await pressLabel('Open profile menu');
  await pressButton('Help & support');
  expect(hasText('How can we help?')).toBe(true);
  expect(hasText('How do I buy an item?')).toBe(true);

  await pressButton('Payments');
  expect(hasText('How do I buy an item?')).toBe(false);
  await pressButton('What fees do I pay?');
  expect(
    renderer!.root.findAll(
      node =>
        typeof node.props.children === 'string' &&
        node.props.children.includes('flat AED 10 platform fee'),
    ).length,
  ).toBeGreaterThan(0);

  await pressButton('All');
  await typeInto('Search help articles', 'verification');
  expect(hasText('I didn’t get my verification code')).toBe(true);
  expect(hasText('What fees do I pay?')).toBe(false);
  await typeInto('Search help articles', 'zzz');
  expect(hasText('No articles found')).toBe(true);
});

test('Profile drawer logs out to the Welcome screen', async () => {
  await showOtp();
  await typeInto('Verification code', '123456');
  await pressButton('Verify');
  await pressLabel('Open profile menu');
  await pressButton('Log out');
  expect(hasText('Discover great deals')).toBe(true);
});

test('OTP asks for all 6 digits before verifying', async () => {
  await showOtp();
  await typeInto('Verification code', '123');
  await pressButton('Verify');
  expect(hasText('Enter all 6 digits.')).toBe(true);
  expect(hasText('Enter verification code')).toBe(true);
});

test('OTP offers to resend the code after 30 seconds', async () => {
  await showOtp();
  expect(hasText('Resend code in 0:30')).toBe(true);
  for (let second = 0; second < 30; second++) {
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(1000);
    });
  }
  expect(hasText('Resend code')).toBe(true);
  await pressButton('Resend code');
  expect(hasText('Resend code in 0:30')).toBe(true);
});

test('Welcome shows each illustration with its own text', async () => {
  await showWelcome();
  const visibleSlide = () =>
    renderer!.root.findAll(
      node =>
        typeof node.props.testID === 'string' &&
        node.props.testID.startsWith('welcome-slide-') &&
        node.props.importantForAccessibility === 'auto',
    )[0].props.testID;

  expect(hasText('Discover great deals')).toBe(true);
  expect(hasText('Snap a photo, set a price, done.')).toBe(true);
  expect(visibleSlide()).toBe('welcome-slide-0');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(3500);
  });
  expect(visibleSlide()).toBe('welcome-slide-1');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(3500);
  });
  expect(visibleSlide()).toBe('welcome-slide-2');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(3500);
  });
  expect(visibleSlide()).toBe('welcome-slide-0');
});

test('I already have an account opens Login', async () => {
  await showWelcome();
  await pressButton('I already have an account');
  expect(hasText('Log in with your phone')).toBe(true);
});

test('Login accepts a number for a country chosen in the picker', async () => {
  await showLogin();
  const picker = renderer!.root.find(
    node => node.props.countryCode === 'AE' && node.props.onSelect,
  );
  await ReactTestRenderer.act(async () => {
    picker.props.onSelect({ cca2: 'IN' });
  });
  expect(hasText('+91')).toBe(true);

  await typeInto('Mobile number', '98765 43210');
  await pressButton('Continue');
  expect(hasText('We sent a 6-digit code to +91 98765 43210')).toBe(true);
});
