/**
 * Torchlight — life areas
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
import type { Chart, ChartResponse, LifeAreaReading, LifeAreasResult } from '../api/chart-types';
import { AREA_ICONS, AREA_TONES } from '../ui/lifeAreas';
import { Button, Card, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';
import { LifeAreaDetail } from './LifeAreaDetail';

/**
 * The eight parts of a life, and which of them the current period is touching.
 *
 * "Active" is not decoration: an area is active when a ruler of its houses also
 * rules the running period or sub-period, which is why the screen can say
 * something true about now rather than describing a fixed disposition.
 */
export function LifeAreasScreen({ profileId }: { profileId: string }): React.JSX.Element {
  const theme = useTheme();

  const [result, setResult] = useState<LifeAreasResult | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const [open, setOpen] = useState<LifeAreaReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const [areas, chartResponse] = await Promise.all([
        api.get<LifeAreasResult>(`/profiles/${profileId}/life-areas`),
        api.get<ChartResponse>(`/profiles/${profileId}/chart`),
      ]);
      setResult(areas);
      setChart(chartResponse.chart);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not reach Torchlight.');
    }
  }, [profileId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (open && chart) {
    return <LifeAreaDetail area={open} chart={chart} onBack={() => setOpen(null)} />;
  }

  if (error && !result) {
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

  if (!result) {
    return (
      <Screen>
        <View style={styles.centred}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!result.available) {
    return (
      <Screen>
        <View style={[styles.centred, { padding: theme.spacing.xl }]}>
          <Feather name="clock" size={28} color={theme.colors.iconMuted} />
          <Text variant="title" style={styles.emptyTitle}>
            Life areas need a birth time
          </Text>
          <Text variant="body" tone="muted" style={styles.errorText}>
            Every one of these is a house, and houses move with the clock. Without a time
            they would be guesses, so they are left out.
          </Text>
        </View>
      </Screen>
    );
  }

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
        <Text variant="display">Life areas</Text>
        <Text variant="caption" tone="subtle" style={styles.subtitle}>
          Eight parts of a life, read from the twelve houses
        </Text>

        {result.areas.map((area) => {
          const tone = AREA_TONES(theme)[area.key];
          return (
            <Card
              key={area.key}
              style={styles.card}
              onPress={() => setOpen(area)}
              accessibilityLabel={`${area.name}, ${area.active ? 'active' : 'quiet'}. Open for detail.`}
            >
              <View style={styles.row}>
                <View
                  style={[
                    styles.tile,
                    { backgroundColor: tone.tint, borderRadius: theme.radius.md },
                  ]}
                >
                  <Feather name={AREA_ICONS[area.key]} size={18} color={tone.ink} />
                </View>

                <View style={styles.text}>
                  <Text variant="bodyStrong">{area.name}</Text>
                  <Text variant="caption" tone="subtle">
                    {area.summary}
                  </Text>
                </View>

                <View style={styles.state}>
                  <Text variant="caption" tone={area.active ? 'primary' : 'subtle'}>
                    {area.active
                      ? 'Active'
                      : area.quietUntil
                        ? `Quiet until ${area.quietUntil}`
                        : 'Quiet'}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}

        <Text variant="caption" tone="subtle" style={styles.source}>
          An area is active when a planet ruling one of its houses also rules the period or
          sub-period running now.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', marginVertical: 16 },
  emptyTitle: { marginTop: 16, textAlign: 'center' },
  subtitle: { marginTop: 6, marginBottom: 24 },
  card: { marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tile: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  text: { marginLeft: 12, flex: 1 },
  state: { marginLeft: 8 },
  source: { marginTop: 20 },
});
