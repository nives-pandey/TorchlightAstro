/**
 * Torchlight — root navigation
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../auth/AuthProvider';
import { BirthDetailsScreen } from '../screens/BirthDetailsScreen';
import { ChartScreen } from '../screens/ChartScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { useTheme } from '../ui/ThemeProvider';

/**
 * Which screen a person sees, decided by what the session knows.
 *
 * Three states, and they are mutually exclusive by construction rather than by
 * a stack the user could navigate backwards into:
 *
 *   no session          → sign in
 *   session, no birth   → birth details
 *   session and birth   → chart
 *
 * A stack navigator would let someone swipe back from their chart to the birth
 * form, or back out of the app from sign-in on Android. Deriving the screen
 * from state instead means those transitions cannot be reached at all, which is
 * the correct behaviour and needs no guards to enforce.
 *
 * A navigator is still the right tool once there are screens a person moves
 * between deliberately — a chart detail, settings, a second profile — and this
 * is where it goes when that happens.
 */
export function RootNavigator(): React.JSX.Element {
  const theme = useTheme();
  const { user, restoring, reloadUser } = useAuth();

  // The stored session is being checked. Showing sign-in first and then
  // replacing it a moment later reads as a flicker and looks broken.
  if (restoring) {
    return (
      <View style={[styles.splash, { backgroundColor: theme.colors.bg }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <SignInScreen />;
  }

  if (!user.primaryBirthProfileId) {
    // Saving a profile sets it server-side; reloading the user is what moves
    // this to the chart.
    return <BirthDetailsScreen onSaved={() => { void reloadUser(); }} />;
  }

  return <ChartScreen profileId={user.primaryBirthProfileId} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
