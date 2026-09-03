/**
 * Torchlight — test configuration
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

module.exports = {
  preset: '@react-native/jest-preset',

  /**
   * `node_modules` is excluded from transformation by default, which is right
   * for packages that ship compiled JavaScript. React Native's own packages,
   * and several in its ecosystem, ship untranspiled TypeScript and JSX instead
   * and have to be run through Babel like first-party source.
   */
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-navigation|react-native-keychain)/)',
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
