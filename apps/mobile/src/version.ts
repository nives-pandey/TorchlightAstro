/**
 * Torchlight — version labels
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * What the splash screen states about itself.
 *
 * The design mocked these as "v2.4" and "Swiss Ephemeris 2.10". Neither is
 * true: this is the first release, and Swiss Ephemeris is a development-time
 * reference the engine is *checked against* rather than something that ships
 * inside the app. Printing it on the splash would claim a dependency that is
 * not there.
 *
 * What is true, and worth saying, is which engine computed the chart.
 */
export const VERSION_LABEL = 'v1.0';

/** The engine version, matching ENGINE_VERSION in the backend. */
export const ENGINE_LABEL = 'Engine 1.0.0';
