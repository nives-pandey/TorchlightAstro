/**
 * Torchlight — divisional charts
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import type { Chart } from '../api/chart-types';
import { Panel, Screen, ScreenHeader, SourceNote, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * The sixteen divisional charts.
 *
 * A varga divides each sign into equal parts and maps them onto the twelve
 * signs again, so it is the same birth read at a finer resolution rather than a
 * different chart. Each division is traditionally consulted for one subject —
 * the ninth for marriage, the tenth for career — which is what the subtitle
 * names, since "D9" alone tells a reader nothing.
 */

/** What each division is traditionally read for. */
const DIVISIONS: Readonly<Record<string, { name: string; subject: string }>> = {
  D1: { name: 'the birth chart', subject: 'The whole life · called Rashi' },
  D2: { name: 'the half-part chart', subject: 'Wealth and resources · Hora' },
  D3: { name: 'the third-part chart', subject: 'Siblings and courage · Drekkana' },
  D4: { name: 'the quarter chart', subject: 'Home and property · Chaturthamsha' },
  D7: { name: 'the seventh-part chart', subject: 'Children · Saptamsha' },
  D9: { name: 'the ninth-part chart', subject: 'Marriage and inner strength · Navamsha' },
  D10: { name: 'the tenth-part chart', subject: 'Career and standing · Dashamsha' },
  D12: { name: 'the twelfth-part chart', subject: 'Parents and lineage · Dwadashamsha' },
  D16: { name: 'the sixteenth-part chart', subject: 'Vehicles and comfort · Shodashamsha' },
  D20: { name: 'the twentieth-part chart', subject: 'Spiritual practice · Vimshamsha' },
  D24: { name: 'the twenty-fourth-part chart', subject: 'Learning · Chaturvimshamsha' },
  D27: { name: 'the twenty-seventh-part chart', subject: 'Strengths and weaknesses · Bhamsha' },
  D30: { name: 'the thirtieth-part chart', subject: 'Difficulties · Trimshamsha' },
  D40: { name: 'the fortieth-part chart', subject: 'Maternal legacy · Khavedamsha' },
  D45: { name: 'the forty-fifth-part chart', subject: 'Paternal legacy · Akshavedamsha' },
  D60: { name: 'the sixtieth-part chart', subject: 'The finest reading · Shashtiamsha' },
};

export function DivisionalChartsScreen({
  chart,
  onBack,
}: {
  chart: Chart;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const [selected, setSelected] = useState('D9');

  const available = Object.keys(chart.vedic.vargaCharts);
  const placements = chart.vedic.vargaCharts[selected] ?? [];
  const meta = DIVISIONS[selected];

  // Grouped by sign so the reader sees a chart rather than a list.
  const bySign = new Map<string, string[]>();
  for (const placement of placements) {
    bySign.set(placement.signName, [...(bySign.get(placement.signName) ?? []), placement.planet]);
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg + 4, paddingBottom: theme.spacing.xxxl }}
      >
        <Pressable onPress={onBack} accessibilityRole="button" style={styles.back}>
          <Feather name="chevron-left" size={18} color={theme.colors.iconMuted} />
          <Text variant="caption" tone="muted">
            Chart
          </Text>
        </Pressable>

        <ScreenHeader eyebrow="Sixteen zoom levels" title="Divisional charts" />

        <View style={styles.grid}>
          {available.map((division) => {
            const active = division === selected;
            return (
              <Pressable
                key={division}
                onPress={() => setSelected(division)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.cell,
                  active ? { backgroundColor: theme.colors.primary } : styles.cellIdle,
                  { borderColor: theme.colors.rule },
                ]}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.cellText,
                    { color: active ? theme.colors.primaryContrast : theme.colors.text },
                  ]}
                >
                  {division}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Panel style={styles.detail}>
          <Text variant="title">
            {selected} · {meta?.name ?? 'divisional chart'}
          </Text>
          <Text variant="caption" tone="muted" style={styles.subject}>
            {meta?.subject ?? ''}
          </Text>

          <View style={styles.signs}>
            {[...bySign.entries()].map(([sign, planets]) => (
              <View
                key={sign}
                style={[styles.signRow, { borderBottomColor: theme.colors.border }]}
              >
                <Text variant="caption" tone="muted" style={styles.signName}>
                  {sign}
                </Text>
                <Text variant="body" style={styles.planets}>
                  {planets.join(', ')}
                </Text>
              </View>
            ))}
          </View>

          <SourceNote>
            Parashari division of the sidereal longitudes · Lahiri ayanamsa{' '}
            {chart.vedic.ayanamsaDegrees.toFixed(4)}° · engine {chart.engineVersion}
          </SourceNote>
        </Panel>

        {!chart.hasBirthTime ? (
          <Panel inset style={styles.notice}>
            <Text variant="caption" tone="muted">
              These are computed from the planets alone. With a birth time they would also
              carry houses, which is how a divisional chart is usually read.
            </Text>
          </Panel>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: {
    width: '23%',
    height: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIdle: { backgroundColor: 'transparent' },
  cellText: { fontWeight: '800' },
  detail: { marginTop: 20 },
  subject: { marginTop: 4 },
  signs: { marginTop: 16 },
  signRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  signName: { width: 90 },
  planets: { flex: 1 },
  notice: { marginTop: 12 },
});
