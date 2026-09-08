/**
 * Torchlight — account
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { Button, Card, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * The account, and the two things a person can do to it.
 *
 * Deletion is here because Google Play requires it to be reachable inside the
 * app, and it says plainly what it destroys — a confirmation that hides the
 * consequence is worse than none.
 */
export function YouScreen(): React.JSX.Element {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const confirmDelete = (): void => {
    Alert.alert(
      'Delete your account?',
      'Your profile, your chart and every reading are removed from Torchlight. This cannot be undone.',
      [
        { text: 'Keep my account', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setBusy(true);
              try {
                await api.delete('/auth/me');
                await signOut();
              } catch (caught) {
                Alert.alert(
                  'Could not delete',
                  caught instanceof ApiError
                    ? caught.message
                    : 'Something went wrong. Your account is unchanged.',
                );
              } finally {
                setBusy(false);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl }}
      >
        <Text variant="display">You</Text>

        <Text variant="label" tone="muted" style={styles.section}>
          ACCOUNT
        </Text>
        <Card>
          <View style={styles.row}>
            <Feather name="user" size={18} color={theme.colors.iconMuted} />
            <View style={styles.rowText}>
              <Text variant="bodyStrong">{user?.displayName ?? 'Signed in'}</Text>
              {user?.email ? (
                <Text variant="caption" tone="muted">
                  {user.email}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>

        <Text variant="label" tone="muted" style={styles.section}>
          SESSION
        </Text>
        <Button
          label="Sign out"
          variant="secondary"
          block
          onPress={() => { void signOut(); }}
        />

        <Text variant="label" tone="muted" style={styles.section}>
          DELETE
        </Text>
        <Card>
          <Text variant="caption" tone="muted">
            Deleting removes your profile, your chart and every reading. It cannot be undone.
          </Text>
        </Card>
        <Button
          label="Delete account"
          variant="quiet"
          block
          loading={busy}
          onPress={confirmDelete}
          style={styles.delete}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 32, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { marginLeft: 12, flex: 1 },
  delete: { marginTop: 8 },
});
