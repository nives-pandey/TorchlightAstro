/**
 * Torchlight — sign in
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { GOOGLE_SIGN_IN_AVAILABLE } from '../config';
import { Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * One way in.
 *
 * No email field, no password field, no create-account toggle: signing in for
 * the first time *is* creating the account. That removes four screens most apps
 * need — registration, password reset, forgot-password, email verification —
 * and none of them was ever worth the reader's attention.
 */
export function SignInScreen(): React.JSX.Element {
  const theme = useTheme();
  const { signInWithGoogle } = useAuth();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const google = async (): Promise<void> => {
    if (!GOOGLE_SIGN_IN_AVAILABLE) {
      // Better to say so than to open a Google dialog that cannot complete.
      setError('Google sign-in is not configured in this build yet.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (caught) {
      // A cancelled sign-in is a decision, not a failure, and should not be
      // reported as one.
      if (caught instanceof Error && caught.message === 'cancelled') {
        setError(null);
      } else {
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'Could not sign in with Google. Try again.',
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={[styles.content, { padding: theme.spacing.lg + 4 }]}>
        <View style={styles.head}>
          <Text variant="label" tone="primary">
            Account
          </Text>
          <Text variant="display" style={styles.title}>
            Sign in
          </Text>
          <View style={[styles.underline, { backgroundColor: theme.colors.rule }]} />
        </View>

        <Text variant="body" tone="muted" style={styles.blurb}>
          One account so your charts follow you to a new phone. Nothing else is asked for.
        </Text>

        <Pressable
          onPress={() => { void google(); }}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          style={({ pressed }) => [
            styles.primary,
            { backgroundColor: theme.colors.primary, opacity: pressed || busy ? 0.75 : 1 },
          ]}
        >
          <Feather name="user" size={20} color={theme.colors.primaryContrast} />
          <Text variant="bodyStrong" style={[styles.primaryLabel, { color: theme.colors.primaryContrast }]}>
            {busy ? 'Signing in…' : 'Continue with Google'}
          </Text>
        </Pressable>

        {error ? (
          <View
            style={[
              styles.error,
              { backgroundColor: theme.colors.dangerSurface, padding: theme.spacing.md },
            ]}
          >
            <Text variant="caption" tone="danger">
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.foot}>
          <View style={[styles.rule, { backgroundColor: theme.colors.rule }]} />
          <Text variant="caption" tone="muted">
            Your birth details and every chart are stored against this account, so they
            follow you to a new phone.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  head: { marginBottom: 22 },
  title: { marginTop: 8 },
  underline: { width: 56, height: 2, marginTop: 8 },
  blurb: { marginBottom: 22 },
  primary: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primaryLabel: { marginLeft: 12, fontWeight: '800' },
  error: { marginTop: 16 },
  foot: { marginTop: 'auto' },
  rule: { height: 2, marginBottom: 10 },
});
