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
import { StyleSheet, View } from 'react-native';

import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { Button, Screen, Text, TextField } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * One screen for both signing in and creating an account.
 *
 * Separate screens would mean a person who guessed wrong has to find their way
 * to the other one. A single toggle is one tap, and the fields differ by
 * exactly one.
 */
export function SignInScreen(): React.JSX.Element {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    setFieldErrors({});

    try {
      if (creating) {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        // Per-field messages from the server are shown against their field
        // rather than collapsed into one banner, so the person can see which
        // input to fix.
        const fields: Record<string, string> = {};
        for (const key of ['email', 'password', 'displayName']) {
          const message = caught.fieldError(key);
          if (message) fields[key] = message;
        }
        setFieldErrors(fields);
      } else {
        setError('Could not reach Torchlight. Check your connection.');
      }
    } finally {
      setBusy(false);
    }
  };

  const ready = email.trim().length > 0 && password.length > 0 && (!creating || name.trim().length > 0);

  return (
    <Screen scroll avoidKeyboard>
      <View style={[styles.content, { padding: theme.spacing.xl }]}>
        <View style={styles.header}>
          <Text variant="display">Torchlight</Text>
          <Text variant="body" tone="muted" style={styles.tagline}>
            Your chart, read through ten traditions.
          </Text>
        </View>

        {creating ? (
          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            error={fieldErrors.displayName}
          />
        ) : null}

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          error={fieldErrors.email}
        />

        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete={creating ? 'new-password' : 'current-password'}
          textContentType={creating ? 'newPassword' : 'password'}
          error={fieldErrors.password}
          hint={creating ? 'At least 10 characters' : undefined}
        />

        {error ? (
          <View
            style={[
              styles.banner,
              {
                backgroundColor: theme.colors.dangerSurface,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              },
            ]}
          >
            <Text variant="caption" tone="danger">
              {error}
            </Text>
          </View>
        ) : null}

        <Button
          label={creating ? 'Create account' : 'Sign in'}
          onPress={() => { void submit(); }}
          loading={busy}
          disabled={!ready}
          block
          style={styles.submit}
        />

        <Button
          label={creating ? 'I already have an account' : 'Create an account'}
          variant="quiet"
          onPress={() => {
            setCreating((previous) => !previous);
            setError(null);
            setFieldErrors({});
          }}
          block
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center' },
  header: { marginBottom: 40 },
  tagline: { marginTop: 8 },
  banner: { marginBottom: 16 },
  submit: { marginTop: 8, marginBottom: 8 },
});
