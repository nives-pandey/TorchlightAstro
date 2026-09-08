/**
 * Torchlight — chart overview
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
import {
  DIMENSION_POLES,
  TROPICAL_SIGNS,
  type Chart,
  type ChartResponse,
  type DimensionSynthesis,
} from '../api/chart-types';
import { useAuth } from '../auth/AuthProvider';
import { Panel, Screen, ScreenHeader, SourceNote, Text } from '../ui/components';
import { traditionInitial } from '../ui/traditions';
import { useTheme } from '../ui/ThemeProvider';
import { BirthSkyScreen } from './BirthSkyScreen';
import { DimensionDetail } from './DimensionDetail';
import { DivisionalChartsScreen } from './DivisionalChartsScreen';
import { StoneColourScreen } from './StoneColourScreen';
import { TraditionDetail } from './TraditionDetail';

/**
 * The chart, and every tradition that read it.
 *
 * The five trait dimensions live here rather than on the home screen. They
 * answer "what sort of person are you" with five adjectives, which is the least
 * specific thing this engine knows — worth finding, not worth leading with.
 */
export function ChartScreen({
  profileId,
  houseSystem = 'placidus',
}: {
  profileId: string;
  houseSystem?: 'placidus' | 'whole-sign';
}): React.JSX.Element {
  const theme = useTheme();
  const { user } = useAuth();

  const [chart, setChart] = useState<Chart | null>(null);
  const [dimension, setDimension] = useState<DimensionSynthesis | null>(null);
  const [tradition, setTradition] = useState<string | null>(null);
  const [detail, setDetail] = useState<'sky' | 'vargas' | 'stones' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<ChartResponse>(`/profiles/${profileId}/chart?houseSystem=${houseSystem}`);
      setChart(response.chart);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not reach Torchlight.');
    }
  }, [profileId, houseSystem]);

  useEffect(() => {
    void load();
  }, [load]);

  if (dimension && chart) {
    return (
      <DimensionDetail
        dimension={dimension}
        index={chart.synthesis.dimensions.findIndex((d) => d.dimension === dimension.dimension)}
        total={chart.synthesis.dimensions.length}
        onBack={() => setDimension(null)}
      />
    );
  }

  if (tradition && chart) {
    return (
      <TraditionDetail
        system={tradition}
        chart={chart}
        onBack={() => setTradition(null)}
      />
    );
  }

  if (detail === 'sky' && chart) {
    return <BirthSkyScreen chart={chart} onBack={() => setDetail(null)} />;
  }

  if (detail === 'vargas' && chart) {
    return <DivisionalChartsScreen chart={chart} onBack={() => setDetail(null)} />;
  }

  if (detail === 'stones' && chart) {
    return <StoneColourScreen chart={chart} onBack={() => setDetail(null)} />;
  }

  if (error && !chart) {
    return (
      <Screen>
        <View style={[styles.centred, { padding: theme.spacing.xl }]}>
          <Feather name="cloud-off" size={28} color={theme.colors.iconMuted} />
          <Text variant="body" tone="muted" style={styles.errorText}>
            {error}
          </Text>
          <Pressable onPress={() => { void load(); }} style={styles.retry}>
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

  const sun = chart.western.planets.find((p) => p.name === 'Sun');
  const systems = chart.synthesis.systems;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg + 4, paddingBottom: theme.spacing.xxxl }}
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
        <ScreenHeader eyebrow="Your chart" title={user?.displayName ?? 'Chart'} />

        {/* The three placements a reader recognises first. */}
        <Panel>
          <View style={styles.headline}>
            {chart.vedic.ascendantRashi ? (
              <Placement label="Rising" value={chart.vedic.ascendantRashi.name} />
            ) : null}
            {sun ? (
              <Placement label="Sun" value={TROPICAL_SIGNS[sun.signIndex] ?? ''} />
            ) : null}
            <Placement label="Moon" value={chart.vedic.moonRashi.name} />
          </View>
          <SourceNote>
            Rising and Moon sidereal (Lahiri, whole-sign); Sun shown tropical · engine{' '}
            {chart.engineVersion}
          </SourceNote>
        </Panel>

        {!chart.hasBirthTime ? (
          <Panel style={styles.block}>
            <Text variant="caption" tone="muted">
              Without a birth time your rising sign, the divisional charts and the birth day
              sky are left out rather than guessed.
            </Text>
          </Panel>
        ) : null}

        <Text variant="label" tone="muted" style={styles.section}>
          FIVE DIMENSIONS · {systems.length} TRADITIONS READ
        </Text>

        {chart.synthesis.dimensions.map((entry) => {
          const poles = DIMENSION_POLES[entry.dimension];
          const supporting = entry.readings.filter((r) => r.value > 0).length;
          const opposing = entry.readings.filter((r) => r.value < 0).length;
          const split = supporting > 0 && opposing > 0;
          const claim =
            entry.pole ?? (split ? `Split ${Math.max(supporting, opposing)}–${Math.min(supporting, opposing)}` : 'Balanced');

          return (
            <Panel
              key={entry.dimension}
              style={styles.block}
              onPress={() => setDimension(entry)}
              accessibilityLabel={`${poles.question} ${claim}. Open for each tradition's reading.`}
            >
              <View style={styles.dimensionHead}>
                <Text variant="bodyStrong">{capitalise(entry.dimension)}</Text>
                <Text variant="caption" tone={split ? 'accent' : 'primary'}>
                  {split ? `Split ${Math.max(supporting, opposing)}–${Math.min(supporting, opposing)}` : claim}
                </Text>
              </View>

              <View style={styles.chips}>
                {entry.readings.map((reading) => (
                  <Chip
                    key={reading.system}
                    letter={traditionInitial(reading.system)}
                    positive={reading.value >= 0}
                  />
                ))}
              </View>

              <View style={styles.poles}>
                <Text variant="caption" tone="subtle">
                  {poles.low}
                </Text>
                <Text variant="caption" tone="subtle">
                  {poles.high}
                </Text>
              </View>
            </Panel>
          );
        })}

        <Text variant="label" tone="muted" style={styles.section}>
          THE TRADITIONS
        </Text>

        {systems.map((system) => (
          <Panel
            key={system}
            style={styles.block}
            onPress={() => setTradition(system)}
            accessibilityLabel={`Open ${system} placements`}
          >
            <View style={styles.traditionRow}>
              <Text variant="bodyStrong">{traditionInitial(system)}</Text>
              <Text variant="body" style={styles.traditionName}>
                {capitalise(system)}
              </Text>
              <Feather name="chevron-right" size={18} color={theme.colors.iconMuted} />
            </View>
          </Panel>
        ))}

        <Text variant="label" tone="muted" style={styles.section}>
          GOING DEEPER
        </Text>

        {(
          [
            ['sky', 'The sky on your birth day', 'Four measures of the day itself'],
            ['vargas', 'Divisional charts', 'The same birth at sixteen resolutions'],
            ['stones', 'Stone & colour', 'What the tradition prescribes, and why'],
          ] as const
        ).map(([key, title, note]) => (
          <Panel
            key={key}
            style={styles.block}
            onPress={() => setDetail(key)}
            accessibilityLabel={`Open ${title}`}
          >
            <View style={styles.traditionRow}>
              <View style={styles.deeperText}>
                <Text variant="bodyStrong">{title}</Text>
                <Text variant="caption" tone="subtle">
                  {note}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.colors.iconMuted} />
            </View>
          </Panel>
        ))}
      </ScrollView>
    </Screen>
  );
}

function Placement({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.placement}>
      <Text variant="label" tone="subtle">
        {label}
      </Text>
      <Text variant="title" style={styles.placementValue}>
        {value}
      </Text>
    </View>
  );
}

/** One tradition's position on a dimension, as a single letter. */
function Chip({ letter, positive }: { letter: string; positive: boolean }): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          borderColor: theme.colors.rule,
          backgroundColor: positive ? theme.colors.primaryTint : theme.colors.surface2,
        },
      ]}
    >
      <Text variant="caption" style={styles.chipText}>
        {letter}
      </Text>
    </View>
  );
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', marginVertical: 16 },
  retry: { padding: 12 },
  headline: { flexDirection: 'row', justifyContent: 'space-between' },
  placement: { flex: 1 },
  placementValue: { marginTop: 4 },
  block: { marginTop: 8 },
  section: { marginTop: 28, marginBottom: 12 },
  dimensionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', gap: 6, marginTop: 12 },
  chip: { width: 28, height: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontWeight: '800' },
  poles: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  traditionRow: { flexDirection: 'row', alignItems: 'center' },
  traditionName: { flex: 1, marginLeft: 12 },
  deeperText: { flex: 1 },
});
