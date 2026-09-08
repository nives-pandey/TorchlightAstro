/**
 * Torchlight — timeline
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import type { Chart, ChartResponse } from '../api/chart-types';
import { Button, Card, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * A life in periods, from birth onward.
 *
 * The Vimshottari sequence covers 120 years, so this is the one screen that can
 * show a whole life at once with real dates rather than a mood. The period
 * running now is marked and expanded; the rest stay readable but quiet.
 */
export function TimelineScreen({ profileId }: { profileId: string }): React.JSX.Element {
  const theme = useTheme();

  const [chart, setChart] = useState<Chart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<ChartResponse>(`/profiles/${profileId}/chart`);
      setChart(response.chart);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not reach Torchlight.');
    }
  }, [profileId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error && !chart) {
    return (
      <Screen>
        <View style={[styles.centred, { padding: theme.spacing.xl }]}>
          <Feather name="cloud-off" size={28} color={theme.colors.iconMuted} />
          <Text variant="body" tone="muted" style={styles.errorText}>
            {error}
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => { void load(); }} />
        </View>
      </Screen>
    );
  }

  if (!chart) {
    return (
      <Screen>
        <View style={styles.centred}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  const now = Date.now();
  const periods = chart.vedic.dashas;
  const sub = chart.vedic.currentDasha?.antardasha ?? null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={theme.colors.primary}
            onRefresh={() => {
              setRefreshing(true);
              void load().finally(() => setRefreshing(false));
            }}
          />
        }
      >
        <Text variant="display">Timeline</Text>
        <Text variant="caption" tone="subtle" style={styles.subtitle}>
          Your life in planetary periods
        </Text>

        {periods.map((period) => {
          const start = new Date(period.start);
          const end = new Date(period.end);
          const running = start.getTime() <= now && end.getTime() > now;
          const finished = end.getTime() <= now;

          return (
            <Card
              key={`${period.planet}-${period.start}`}
              style={running ? { ...styles.card, borderColor: theme.colors.primary } : styles.card}
            >
              <View style={styles.row}>
                <View style={styles.years}>
                  <Text variant="caption" tone={running ? 'primary' : 'subtle'}>
                    {start.getFullYear()}
                  </Text>
                  <Text variant="caption" tone="subtle">
                    {end.getFullYear()}
                  </Text>
                </View>

                <View style={styles.body}>
                  <Text variant={running ? 'bodyStrong' : 'body'} tone={finished ? 'muted' : 'default'}>
                    {period.planet} period
                  </Text>
                  <Text variant="caption" tone="subtle">
                    {Math.round(period.years)} years
                    {running ? ' · running now' : finished ? ' · past' : ''}
                  </Text>

                  {running && sub ? (
                    <Text variant="caption" tone="muted" style={styles.sub}>
                      {sub.planet} sub-period to {new Date(sub.end).getFullYear()}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          );
        })}

        <Text variant="caption" tone="subtle" style={styles.source}>
          Vimshottari periods, a 120-year cycle. The Moon's position at birth sets where the
          cycle starts.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', marginVertical: 16 },
  subtitle: { marginTop: 6, marginBottom: 24 },
  card: { marginBottom: 8 },
  row: { flexDirection: 'row' },
  years: { width: 48 },
  body: { flex: 1, marginLeft: 12 },
  sub: { marginTop: 6 },
  source: { marginTop: 20 },
});
