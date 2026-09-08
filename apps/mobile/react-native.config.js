/**
 * Torchlight — asset linking
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

module.exports = {
  // `npx react-native-asset` copies these into the native projects. Archivo is
  // the family the design system is built on; the four weights are separate
  // files because Android resolves a font by its internal family+style name
  // rather than by a weight axis.
  assets: ['./src/assets/fonts'],
};
