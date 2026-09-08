/**
 * Torchlight — build configuration
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * The Google OAuth web client id.
 *
 * This is the *web* client, not the Android one. The Android client authorises
 * the app to ask for a token; the token itself is minted for the web client,
 * and that is the audience the backend verifies against. Using the Android id
 * here yields a token the server correctly refuses.
 *
 * Not a secret — a client id is public by design, and the security comes from
 * Google signing the token and the backend checking that signature.
 *
 * Empty until the OAuth client exists in Google Cloud. The sign-in button
 * reports that plainly rather than failing silently.
 */
export const GOOGLE_CLIENT_ID = '';

/** Whether Google sign-in can work at all in this build. */
export const GOOGLE_SIGN_IN_AVAILABLE = GOOGLE_CLIENT_ID.length > 0;
