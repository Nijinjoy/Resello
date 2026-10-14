/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BootSplash from 'react-native-bootsplash';
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

test('moves from Splash to Welcome, pages through it, then to Home', async () => {
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
  expect(hasText('Pre-Loved. Better Priced.')).toBe(true);
  expect(hasText('Continue')).toBe(true);
  expect(hasText('Skip')).toBe(true);
  expect(hasText('I already have an account')).toBe(false);

  await pressButton('Continue');
  await pressButton('Continue');
  expect(hasText('Get Started')).toBe(true);
  expect(hasText('Skip')).toBe(false);
  expect(hasText('I already have an account')).toBe(true);

  await pressButton('Get Started');
  expect(hasText('Home')).toBe(true);
  expect(hasText('Get Started')).toBe(false);
});

test('Skip jumps to the last Welcome page', async () => {
  await showWelcome();
  await pressButton('Skip');
  expect(hasText('Get Started')).toBe(true);
});

test('shows the Welcome screen in Arabic on Arabic devices', async () => {
  const localeSpy = jest.spyOn(Intl, 'DateTimeFormat').mockImplementation(
    () =>
      ({
        resolvedOptions: () => ({ locale: 'ar-AE' }),
      } as Intl.DateTimeFormat),
  );
  try {
    await showWelcome();
  } finally {
    localeSpy.mockRestore();
  }

  expect(hasText('مستعمل بعناية. بسعر أفضل.')).toBe(true);
  expect(hasText('متابعة')).toBe(true);
  expect(hasText('Continue')).toBe(false);
});
