/**
 * Torchlight — you
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { Panel, Screen, ScreenHeader, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';
import { ContributionScreen } from './ContributionScreen';
import { SettingsScreen, type HouseSystem } from './SettingsScreen';

interface ProfileRow {
  id: string;
  displayName: string;
  birthDate: string;
  birthTime: string | null;
  placeName: string;
  isSelf: boolean;
}

/**
 * Saved births, the account, and everything that changes how charts are read.
 *
 * A profile without a birth time is shown as limited rather than hidden — four
 * of the traditions genuinely cannot run without one, and saying which is more
 * useful than a chart that quietly omits them.
 */
export function YouScreen({
  houseSystem,
  onHouseSystemChange,
}: {
  houseSystem: HouseSystem;
  onHouseSystemChange: (system: HouseSystem) => void;
}): React.JSX.Element {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const [profiles, setProfiles] = useState<ProfileRow[] | null>(null);
  const [view, setView] = useState<'root' | 'settings' | 'support'>('root');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      setProfiles(await api.get<ProfileRow[]>('/profiles'));
    } catch {
      setProfiles([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmDelete = (): void => {
    Alert.alert(
      'Delete your account?',
      'Your profiles, your charts and every reading are removed from Torchlight. This cannot be undone.',
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

  if (view === 'settings') {
    return (
      <SettingsScreen
        houseSystem={houseSystem}
        onHouseSystemChange={onHouseSystemChange}
        onBack={() => setView('root')}
        onContribute={() => setView('support')}
      />
    );
  }

  if (view === 'support') {
    return <ContributionScreen onBack={() => setView('root')} />;
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg + 4, paddingBottom: theme.spacing.xxxl }}
      >
        <ScreenHeader
          eyebrow={profiles ? `${profiles.length} saved` : undefined}
          title="You"
        />

        {profiles === null ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.spinner} />
        ) : (
          profiles.map((profile) => (
            <Panel key={profile.id} emphasis={profile.isSelf} style={styles.block}>
              <View style={styles.profileHead}>
                <Text variant="bodyStrong">{profile.displayName}</Text>
                {profile.isSelf ? (
                  <Text variant="label" tone="primary">
                    Active
                  </Text>
                ) : null}
              </View>

              <Text variant="caption" tone="muted" style={styles.profileMeta}>
                {formatDate(profile.birthDate)} ·{' '}
                {profile.birthTime ?? 'time unknown'} · {profile.placeName}
              </Text>

              {!profile.birthTime ? (
                <Text variant="caption" tone="accent" style={styles.blocked}>
                  Rising sign, divisional charts, Human Design and the birth day sky all need a
                  birth time.
                </Text>
              ) : null}
            </Panel>
          ))
        )}

        <Text variant="label" tone="muted" style={styles.section}>
          ACCOUNT
        </Text>

        <Panel>
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
        </Panel>

        <Panel
          style={styles.block}
          onPress={() => setView('settings')}
          accessibilityLabel="Open settings"
        >
          <View style={styles.row}>
            <Feather name="sliders" size={18} color={theme.colors.iconMuted} />
            <Text variant="body" style={styles.rowLabel}>
              Settings
            </Text>
            <Feather name="chevron-right" size={18} color={theme.colors.iconMuted} />
          </View>
        </Panel>

        <Panel
          style={styles.block}
          onPress={() => { void signOut(); }}
          accessibilityLabel="Sign out"
        >
          <View style={styles.row}>
            <Feather name="log-out" size={18} color={theme.colors.iconMuted} />
            <Text variant="body" style={styles.rowLabel}>
              Sign out
            </Text>
          </View>
        </Panel>

        <Text variant="label" tone="muted" style={styles.section}>
          DELETE
        </Text>

        <Panel>
          <Text variant="caption" tone="muted">
            Deleting removes your profiles, your charts and every reading. It cannot be undone.
          </Text>
          <Pressable
            onPress={confirmDelete}
            disabled={busy}
            accessibilityRole="button"
            style={[styles.delete, { borderColor: theme.colors.danger }]}
          >
            <Text variant="bodyStrong" tone="danger">
              {busy ? 'Deleting…' : 'Delete account'}
            </Text>
          </Pressable>
        </Panel>
      </ScrollView>
    </Screen>
  );
}

/** "Aug 15, 1990" — the form the design uses. */
function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  spinner: { marginVertical: 20 },
  block: { marginTop: 8 },
  section: { marginTop: 28, marginBottom: 12 },
  profileHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  profileMeta: { marginTop: 6 },
  blocked: { marginTop: 10, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { marginLeft: 12, flex: 1 },
  rowLabel: { flex: 1, marginLeft: 12 },
  delete: { borderWidth: 2, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
});
