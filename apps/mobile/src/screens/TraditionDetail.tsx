/**
 * Torchlight — one tradition
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

import { DIMENSION_POLES, TROPICAL_SIGNS, type Chart } from '../api/chart-types';
import { Panel, Screen, ScreenHeader, SourceNote, Text } from '../ui/components';
import { TRADITIONS, traditionName } from '../ui/traditions';
import { useTheme } from '../ui/ThemeProvider';

/**
 * What one tradition says, on its own terms.
 *
 * Written once for every system rather than once per system: each tradition
 * produces placements and a set of trait readings, and the shape of "here is
 * what it found, here is where it came from" is the same whether the answer is
 * a rising sign or a day master.
 */
export function TraditionDetail({
  system,
  chart,
  onBack,
}: {
  system: string;
  chart: Chart;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const meta = TRADITIONS[system];

  const readings = chart.synthesis.dimensions
    .map((d) => ({ dimension: d.dimension, reading: d.readings.find((r) => r.system === system) }))
    .filter((entry): entry is { dimension: typeof entry.dimension; reading: NonNullable<typeof entry.reading> } =>
      entry.reading !== undefined,
    );

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
          eyebrow="Tradition"
          title={traditionName(system)}
          subtitle={meta?.note}
        />

        <Text variant="label" tone="muted" style={styles.section}>
          PLACEMENTS
        </Text>
        <Panel>
          {placementsFor(system, chart).map((row, index, all) => (
            <View
              key={row.label}
              style={[
                styles.row,
                index === all.length - 1
                  ? null
                  : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
              ]}
            >
              <Text variant="caption" tone="muted">
                {row.label}
              </Text>
              <Text variant="body">{row.value}</Text>
            </View>
          ))}
          <SourceNote>{sourceFor(system, chart)}</SourceNote>
        </Panel>

        {readings.length > 0 ? (
          <>
            <Text variant="label" tone="muted" style={styles.section}>
              READS
            </Text>
            {readings.map(({ dimension, reading }) => {
              const poles = DIMENSION_POLES[dimension];
              return (
                <Panel key={dimension} style={styles.block}>
                  <View style={styles.readRow}>
                    <Text variant="caption" tone="muted">
                      {capitalise(dimension)}
                    </Text>
                    <Text variant="bodyStrong" tone={reading.value >= 0 ? 'primary' : 'accent'}>
                      {reading.value >= 0 ? poles.high : poles.low}
                    </Text>
                  </View>
                  <SourceNote>{reading.source}</SourceNote>
                </Panel>
              );
            })}
          </>
        ) : (
          <Panel style={styles.block}>
            <Text variant="caption" tone="muted">
              {traditionName(system)} produces placements rather than a personality reading, so
              it does not vote on the five dimensions.
            </Text>
          </Panel>
        )}
      </ScrollView>
    </Screen>
  );
}

/** The placements one tradition is read for. */
function placementsFor(system: string, chart: Chart): { label: string; value: string }[] {
  const sun = chart.western.planets.find((p) => p.name === 'Sun');
  const moon = chart.western.planets.find((p) => p.name === 'Moon');

  switch (system) {
    case 'vedic': {
      const rows = [
        { label: 'Moon sign', value: chart.vedic.moonRashi.name },
        {
          label: 'Moon star',
          value: `${chart.vedic.moonNakshatra.name} · quarter ${chart.vedic.moonNakshatra.pada}`,
        },
        { label: 'Moon star ruler', value: chart.vedic.moonNakshatra.ruler },
      ];
      if (chart.vedic.ascendantRashi) {
        rows.unshift({ label: 'Rising sign', value: chart.vedic.ascendantRashi.name });
      }
      if (chart.vedic.currentDasha) {
        rows.push({
          label: 'Current period',
          value: `${chart.vedic.currentDasha.mahadasha.planet} · ${new Date(
            chart.vedic.currentDasha.mahadasha.start,
          ).getFullYear()}–${new Date(chart.vedic.currentDasha.mahadasha.end).getFullYear()}`,
        });
        if (chart.vedic.currentDasha.antardasha) {
          rows.push({
            label: 'Sub-period',
            value: `${chart.vedic.currentDasha.antardasha.planet} · to ${new Date(
              chart.vedic.currentDasha.antardasha.end,
            ).getFullYear()}`,
          });
        }
      }
      return rows;
    }

    case 'western':
      return chart.western.planets.slice(0, 6).map((planet) => ({
        label: planet.name,
        value: `${TROPICAL_SIGNS[planet.signIndex] ?? ''}${
          planet.house ? ` · ${planet.house}th house` : ''
        }${planet.retrograde ? ' · retrograde' : ''}`,
      }));

    case 'chinese':
      return [
        {
          label: 'Day master',
          value: `${chart.chinese.dayMaster.yang ? 'Yang' : 'Yin'} ${
            chart.chinese.dayMaster.element
          } · ${chart.chinese.dayMaster.pinyin}`,
        },
        { label: 'Year pillar', value: `${chart.chinese.year.pinyin} · ${chart.chinese.year.ganZhi}` },
        { label: 'Month pillar', value: `${chart.chinese.month.pinyin} · ${chart.chinese.month.ganZhi}` },
        { label: 'Day pillar', value: `${chart.chinese.day.pinyin} · ${chart.chinese.day.ganZhi}` },
      ];

    case 'numerology':
      return chart.numerology
        ? [
            { label: 'Life path', value: String(chart.numerology.lifePath) },
            { label: 'Expression', value: String(chart.numerology.expression) },
            { label: 'Soul urge', value: String(chart.numerology.soulUrge) },
            { label: 'Personality', value: String(chart.numerology.personality) },
            { label: 'Birthday', value: String(chart.numerology.birthday) },
          ]
        : [{ label: 'Numerology', value: 'Needs a full name' }];

    case 'humanDesign':
      return [
        { label: 'Profile', value: chart.humanDesign.profile },
        {
          label: 'Personality Sun',
          value: `Gate ${chart.humanDesign.personalitySun.gate}, line ${chart.humanDesign.personalitySun.line}`,
        },
        {
          label: 'Design Sun',
          value: `Gate ${chart.humanDesign.designSun.gate}, line ${chart.humanDesign.designSun.line}`,
        },
        { label: 'Active gates', value: String(chart.humanDesign.activeGates.length) },
      ];

    case 'tarot':
      return [
        { label: 'Birth card', value: chart.tarot.primary.name },
        { label: 'Card number', value: String(chart.tarot.primary.number) },
      ];

    default:
      return [
        { label: 'Sun', value: sun ? (TROPICAL_SIGNS[sun.signIndex] ?? '') : '—' },
        { label: 'Moon', value: moon ? (TROPICAL_SIGNS[moon.signIndex] ?? '') : '—' },
      ];
  }
}

/** What the placements above were computed from. */
function sourceFor(system: string, chart: Chart): string {
  switch (system) {
    case 'vedic':
      return `Lahiri ayanamsa ${chart.vedic.ayanamsaDegrees.toFixed(
        4,
      )}° · whole-sign houses · Vimshottari periods · engine ${chart.engineVersion}`;
    case 'western':
      return `Tropical zodiac · ${
        chart.western.houses?.system ?? 'no'
      } houses · engine ${chart.engineVersion}`;
    case 'chinese':
      return `Four pillars from local solar time · engine ${chart.engineVersion}`;
    case 'numerology':
      return `Pythagorean reduction of the birth date and full name · engine ${chart.engineVersion}`;
    case 'humanDesign':
      return `Design date at 88° of solar arc before birth · engine ${chart.engineVersion}`;
    case 'tarot':
      return `Digit sum of the birth date, reduced to the Major Arcana · engine ${chart.engineVersion}`;
    default:
      return `Engine ${chart.engineVersion}`;
  }
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  section: { marginTop: 24, marginBottom: 12 },
  block: { marginTop: 8 },
  row: { paddingVertical: 10 },
  readRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
});
