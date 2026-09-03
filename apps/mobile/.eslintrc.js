/**
 * Torchlight — lint rules
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    /**
     * `void somePromise()` is how a promise is marked as deliberately not
     * awaited — an event handler cannot be async, and dropping the marker would
     * leave an unhandled rejection with nothing to say it was intended.
     *
     * The default rule forbids the operator outright, which puts it in direct
     * conflict with that. Allowing it as a statement keeps the intent visible
     * while still rejecting `void` used as a value.
     */
    'no-void': ['warn', { allowAsStatement: true }],
  },
};
