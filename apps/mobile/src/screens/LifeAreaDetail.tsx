/**
 * Torchlight — one life area
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import type { Chart, LifeAreaReading } from '../api/chart-types';
import { AREA_ICONS, AREA_TONES } from '../ui/lifeAreas';
import { Panel, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * One part of a life, across time.
 *
 * The dasha sequence is what makes this screen possible: each period is a
 * bounded stretch with a ruling planet, so "what was this area like, what is it
 * like, what comes next" is a question the engine can answer with dates rather
 * than with atmosphere.
 *
 * Every claim names the placement it came from. A reading that cannot say where
 * it came from is indistinguishable from one that was invented, and this screen
 * makes larger claims than any other.
 */
export function LifeAreaDetail({
  area,
  chart,
  onBack,
}: {
  area: LifeAreaReading;
  chart: Chart;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const tone = AREA_TONES(theme)[area.key];

  const dasha = chart.vedic.currentDasha;
  const periods = chart.vedic.dashas;
  const now = Date.now();

  const past = periods.filter((p) => new Date(p.end).getTime() < now);
  const running = periods.find(
    (p) => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now,
  );
  const ahead = periods.filter((p) => new Date(p.start).getTime() > now);

  /** Whether a period's ruler owns one of this area's houses. */
  const owns = (planet: string): boolean => area.rulers.includes(planet);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl }}
      >
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to life areas"
          style={styles.back}
        >
          <Feather name="chevron-left" size={18} color={theme.colors.iconMuted} />
          <Text variant="caption" tone="muted">
            Life areas
          </Text>
        </Pressable>

        <View style={styles.head}>
          <View
            style={[styles.tile, { backgroundColor: tone.tint, borderRadius: theme.radius.md }]}
          >
            <Feather name={AREA_ICONS[area.key]} size={20} color={tone.ink} />
          </View>
          <View style={styles.headText}>
            <Text variant="display">{area.name}</Text>
            <Text variant="caption" tone="subtle">
              {area.houses.length === 1
                ? `${ordinal(area.houses[0] as number)} house`
                : `${area.houses.map((h) => ordinal(h)).join(' and ')} houses`}{' '}
              · {area.summary}
            </Text>
          </View>
        </View>

        {/* What the tradition says these houses concern. */}
        <Panel style={styles.card}>
          <Text variant="body">This area covers {area.domains.join(', ')}.</Text>
          <Text variant="caption" tone="subtle" style={styles.source}>
            Ruled by {area.rulers.join(' and ')} · {area.houses.map((h) => ordinal(h)).join(', ')}{' '}
            from {chart.vedic.ascendantRashi?.name ?? 'the ascendant'} rising
          </Text>
        </Panel>

        {area.occupants.length > 0 ? (
          <>
            <Text variant="label" tone="muted" style={styles.section}>
              WHAT SITS HERE
            </Text>
            <Panel style={styles.card}>
              {area.occupants.map((occupant, index) => (
                <View
                  key={`${occupant.planet}-${occupant.house}`}
                  style={[
                    styles.detail,
                    index === area.occupants.length - 1
                      ? null
                      : {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: theme.colors.border,
                        },
                  ]}
                >
                  <Text variant="caption" tone="muted">
                    {ordinal(occupant.house)} house
                  </Text>
                  <Text variant="body">
                    {occupant.planet}
                    {occupant.retrograde ? ' · retrograde' : ''}
                  </Text>
                </View>
              ))}
            </Panel>
          </>
        ) : null}

        <Text variant="label" tone="muted" style={styles.section}>
          ACROSS TIME
        </Text>

        {past.length > 0 ? (
          <Panel style={styles.card}>
            <Text variant="caption" tone="subtle">
              Until {new Date(past[past.length - 1]?.end ?? 0).getFullYear()}
            </Text>
            <Text variant="body" style={styles.periodBody}>
              {past.filter((p) => owns(p.planet)).length > 0
                ? `${past
                    .filter((p) => owns(p.planet))
                    .map((p) => p.planet)
                    .join(' and ')} ruled here in earlier periods, so this area had its turns before now.`
                : 'No earlier period was ruled by a planet that owns this area.'}
            </Text>
          </Panel>
        ) : null}

        {running ? (
          <Panel style={{ ...styles.card, borderColor: tone.ink }}>
            <Text variant="caption" tone="primary">
              Now · to {new Date(running.end).getFullYear()}
            </Text>
            <Text variant="body" style={styles.periodBody}>
              {area.active
                ? `${dasha?.antardasha && owns(dasha.antardasha.planet)
                    ? dasha.antardasha.planet
                    : running.planet} rules this area and is running now${
                    area.activatedBy === 'sub-period' ? ' as the sub-period' : ''
                  }. This is one of its stronger stretches.`
                : `The ${running.planet} period does not rule this area, so it runs quietly rather than prominently.`}
            </Text>
            <Text variant="caption" tone="subtle" style={styles.source}>
              {running.planet} period {new Date(running.start).getFullYear()}–
              {new Date(running.end).getFullYear()}
              {dasha?.antardasha
                ? ` · ${dasha.antardasha.planet} sub-period to ${new Date(
                    dasha.antardasha.end,
                  ).getFullYear()}`
                : ''}
            </Text>
          </Panel>
        ) : null}

        {ahead.length > 0 ? (
          <Panel style={styles.card}>
            <Text variant="caption" tone="subtle">
              From {new Date(ahead[0]?.start ?? 0).getFullYear()}
            </Text>
            <Text variant="body" style={styles.periodBody}>
              {ahead.filter((p) => owns(p.planet)).length > 0
                ? `${ahead
                    .filter((p) => owns(p.planet))
                    .slice(0, 2)
                    .map((p) => `${p.planet} from ${new Date(p.start).getFullYear()}`)
                    .join(', and ')} — this area comes forward again then.`
                : `The next period is ruled by ${ahead[0]?.planet}, which does not own this area.`}
            </Text>
          </Panel>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
  return `${n}${suffix}`;
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headText: { marginLeft: 12, flex: 1 },
  tile: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  card: { marginBottom: 8 },
  section: { marginTop: 28, marginBottom: 12 },
  detail: { paddingVertical: 10 },
  periodBody: { marginTop: 6 },
  source: { marginTop: 10 },
});
