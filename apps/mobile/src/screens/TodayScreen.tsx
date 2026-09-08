/**
 * Torchlight — today
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import type { ChartResponse, LifeAreasResult, Reading } from '../api/chart-types';
import type { Chart } from '../api/chart-types';
import { AREA_ICONS, AREA_TONES } from '../ui/lifeAreas';
import { Panel, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * Where the app opens.
 *
 * Four things and no more: the date, the period a person is living through,
 * the parts of life that period is touching, and a way into the whole chart.
 * Anything that needs a sentence explaining why it is on screen belongs behind
 * a tab instead.
 */
export function TodayScreen({
  profileId,
  houseSystem = 'placidus',
}: {
  profileId: string;
  houseSystem?: 'placidus' | 'whole-sign';
}): React.JSX.Element {
  const theme = useTheme();

  const [chart, setChart] = useState<Chart | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [areas, setAreas] = useState<LifeAreasResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<ChartResponse>(`/profiles/${profileId}/chart?houseSystem=${houseSystem}`);
      setChart(response.chart);
      setError(null);

      // Both are independent of the chart render, so neither blocks it and a
      // failure in one costs a section rather than the screen.
      api
        .get<LifeAreasResult>(`/profiles/${profileId}/life-areas?houseSystem=${houseSystem}`)
        .then(setAreas)
        .catch(() => setAreas(null));
      api
        .get<Reading | null>(`/profiles/${profileId}/reading`)
        .then(setReading)
        .catch(() => setReading(null));
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Could not reach Torchlight.',
      );
    }
  }, [profileId, houseSystem]);

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
          <Pressable
            onPress={() => { void load(); }}
            accessibilityRole="button"
            style={[styles.retry, { borderColor: theme.colors.rule }]}
          >
            <Text variant="bodyStrong" tone="primary">
              Try again
            </Text>
          </Pressable>
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

  const dasha = chart.vedic.currentDasha;
  const active = (areas?.areas ?? []).filter((a) => a.active).slice(0, 4);

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
        <Text variant="caption" tone="subtle">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {reading ? (
          <Text variant="title" style={styles.headline}>
            {firstSentence(reading.now)}
          </Text>
        ) : null}

        {dasha ? (
          <>
            <Text variant="label" tone="muted" style={styles.section}>
              THE LONG WEATHER
            </Text>
            <Panel>
              <Text variant="body">
                You are in a {dasha.mahadasha.planet} period that runs to{' '}
                {new Date(dasha.mahadasha.end).getFullYear()}
                {dasha.antardasha
                  ? `, and a ${dasha.antardasha.planet} sub-period inside it that ends in ${new Date(
                      dasha.antardasha.end,
                    ).getFullYear()}.`
                  : '.'}
              </Text>
            </Panel>
          </>
        ) : null}

        {areas?.available && active.length > 0 ? (
          <>
            <Text variant="label" tone="muted" style={styles.section}>
              ACTIVE NOW · {active.length} OF {areas.areas.length} AREAS
            </Text>
            {active.map((area) => (
              <Panel key={area.key} style={styles.areaCard}>
                <View style={styles.areaRow}>
                  <View
                    style={[
                      styles.tile,
                      {
                        backgroundColor: AREA_TONES(theme)[area.key].tint,
                        borderRadius: theme.radius.md,
                      },
                    ]}
                  >
                    <Feather
                      name={AREA_ICONS[area.key]}
                      size={18}
                      color={AREA_TONES(theme)[area.key].ink}
                    />
                  </View>
                  <View style={styles.areaText}>
                    <Text variant="bodyStrong">{area.name}</Text>
                    <Text variant="caption" tone="muted">
                      {area.rulers[0]} rules it and {area.rulers[0]} is running
                    </Text>
                  </View>
                </View>
              </Panel>
            ))}
          </>
        ) : null}

        {areas && !areas.available ? (
          <Panel style={styles.notice}>
            <Text variant="caption" tone="muted">
              Life areas need a birth time. Without one the houses would be guesses, so they
              are left out.
            </Text>
          </Panel>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

/** The first sentence of the reading, used as the day's headline. */
function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

const styles = StyleSheet.create({
  retry: {
    borderWidth: 2,
    height: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', marginVertical: 16 },
  headline: { marginTop: 8 },
  section: { marginTop: 32, marginBottom: 12 },
  areaCard: { marginBottom: 8 },
  areaRow: { flexDirection: 'row', alignItems: 'center' },
  tile: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  areaText: { marginLeft: 12, flex: 1 },
  notice: { marginTop: 24 },
});
