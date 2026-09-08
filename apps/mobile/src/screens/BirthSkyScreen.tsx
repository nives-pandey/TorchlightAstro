/**
 * Torchlight — the sky on your birth day
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

import type { Chart } from '../api/chart-types';
import { Panel, Screen, ScreenHeader, SourceNote, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * The Panchanga, in English.
 *
 * Four measures of the day itself rather than of the person — which is why the
 * screen says so at the bottom. The traditional names are kept alongside the
 * plain ones because they are what a reader will find if they go looking, but
 * they are never the heading.
 *
 * The fifth limb, the weekday, is absent deliberately: it depends on local
 * sunrise, which the engine does not compute, and inventing it from the
 * calendar date would be wrong on either side of dawn.
 */
export function BirthSkyScreen({
  chart,
  onBack,
}: {
  chart: Chart;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const p = chart.vedic.panchanga;

  const limbs = [
    {
      number: '01',
      label: 'Lunar day',
      value: p.tithi.name,
      note: `${p.tithi.paksha} paksha · day ${p.tithi.indexInPaksha} of the fortnight`,
      source: 'The angle between Moon and Sun at birth, in 12° steps',
    },
    {
      number: '02',
      label: 'Moon star',
      value: `${p.nakshatra.name} · quarter ${p.nakshatra.pada}`,
      note: `Ruled by ${p.nakshatra.ruler}`,
      source: `Moon at ${p.nakshatra.degreesInto.toFixed(2)}° into the star · sidereal, Lahiri · star ${p.nakshatra.index} of 27`,
    },
    {
      number: '03',
      label: 'Sun–Moon angle',
      value: p.yoga.name,
      note: `Combination ${p.yoga.index} of 27`,
      source: 'The sum of the two longitudes, divided into 27 parts',
    },
    {
      number: '04',
      label: 'Half lunar day',
      value: p.karana.name,
      note: `Half of lunar day ${p.tithi.indexInPaksha}`,
      source: 'Each lunar day divides in two; this is the half you were born into',
    },
  ];

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

        <ScreenHeader
          eyebrow="Four measures of the day"
          title="The sky on your birth day"
        />

        {limbs.map((limb) => (
          <Panel key={limb.number} style={styles.block}>
            <View style={styles.head}>
              <Text variant="label" tone="primary">
                {limb.number}
              </Text>
              <Text variant="label" tone="muted" style={styles.limbLabel}>
                {limb.label}
              </Text>
            </View>
            <Text variant="title" style={styles.value}>
              {limb.value}
            </Text>
            <Text variant="caption" tone="muted">
              {limb.note}
            </Text>
            <SourceNote>{limb.source}</SourceNote>
          </Panel>
        ))}

        <Panel inset style={styles.footer}>
          <Text variant="caption" tone="muted">
            These describe the day itself, not your personality. They do not vote on the five
            dimensions.
          </Text>
        </Panel>

        <Text variant="caption" tone="subtle" style={styles.note}>
          The traditional fifth measure is the weekday, which depends on local sunrise rather
          than on the planets. Torchlight leaves it out rather than computing it from the
          calendar date, which would be wrong for anyone born before dawn.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  block: { marginTop: 8 },
  head: { flexDirection: 'row', alignItems: 'baseline' },
  limbLabel: { marginLeft: 10 },
  value: { marginTop: 6, marginBottom: 4 },
  footer: { marginTop: 20 },
  note: { marginTop: 16 },
});
