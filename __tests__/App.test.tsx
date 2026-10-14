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

test('hides the native splash and stays on Splash', async () => {
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(BootSplash.hide).toHaveBeenCalledWith({ fade: true });
  expect(hasText('Resello')).toBe(true);
  expect(hasText('Home')).toBe(false);

  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(2000);
  });

  expect(hasText('Resello')).toBe(true);
  expect(hasText('Home')).toBe(false);
});
