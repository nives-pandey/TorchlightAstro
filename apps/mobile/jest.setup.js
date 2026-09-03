/**
 * Torchlight — test setup
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

/**
 * Native modules have no implementation under Jest, which runs plain Node with
 * no bridge to Android or iOS. Each one is replaced with the smallest stand-in
 * that lets the JavaScript under test run.
 */

// The keychain is hardware-backed storage; there is none in the test
// environment. An empty store is the correct starting state — it is what a
// fresh install has, and it drives the app to its signed-out screen.
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(async () => true),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(async () => true),
}));

// Icons render through a native font. The stand-in keeps the component's
// contract — a name, a size, a colour — so a test can still assert on which
// icon was asked for.
jest.mock('@react-native-vector-icons/feather', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ name }) => Text({ children: name }),
  };
});

// The app talks to the deployed API. Tests must never reach it: a test suite
// that depends on a network is slow, flaky, and can write real data.
global.fetch = jest.fn(async () => {
  throw new Error('Unexpected network call in a test — mock the endpoint instead.');
});
