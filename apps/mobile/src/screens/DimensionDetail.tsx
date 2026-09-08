/**
 * Torchlight — one dimension
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

import { DIMENSION_POLES, type DimensionSynthesis } from '../api/chart-types';
import { Panel, Screen, ScreenHeader, SourceNote, Text } from '../ui/components';
import { traditionInitial, traditionName } from '../ui/traditions';
import { useTheme } from '../ui/ThemeProvider';

/**
 * One trait axis, and every tradition's reading of it.
 *
 * The panel refusing the word "balanced" is the point of this screen. When four
 * traditions say one thing and one says the opposite, the average lands in the
 * middle and describes nobody — the disagreement is the finding, and flattening
 * it into a moderate reading is the failure mode every other app has.
 */
export function DimensionDetail({
  dimension,
  index,
  total,
  onBack,
}: {
  dimension: DimensionSynthesis;
  index: number;
  total: number;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();
  const poles = DIMENSION_POLES[dimension.dimension];

  const positive = dimension.readings.filter((r) => r.value > 0);
  const negative = dimension.readings.filter((r) => r.value < 0);
  const split = positive.length > 0 && negative.length > 0;
  const majority = positive.length >= negative.length ? positive : negative;
  const minority = positive.length >= negative.length ? negative : positive;

  const readings = [...dimension.readings].sort((a, b) => b.value - a.value);

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
          eyebrow={`Dimension ${index + 1} of ${total}`}
          title={capitalise(dimension.dimension)}
        />

        <Panel emphasis={split}>
          <Text variant="bodyStrong" tone={split ? 'accent' : 'primary'}>
            {split
              ? `Split ${majority.length}–${minority.length}`
              : (dimension.pole ?? 'Balanced')}
          </Text>
          <Text variant="caption" tone="muted" style={styles.tally}>
            {split
              ? `${poleFor(majority[0]?.value ?? 0, poles)} ${majority.length} · ${poleFor(
                  minority[0]?.value ?? 0,
                  poles,
                )} ${minority.length}`
              : `All ${dimension.readings.length} traditions that read this agree.`}
          </Text>

          <View style={styles.chips}>
            {readings.map((reading) => (
              <View
                key={reading.system}
                style={[
                  styles.chip,
                  {
                    borderColor: theme.colors.rule,
                    backgroundColor:
                      reading.value >= 0 ? theme.colors.primaryTint : theme.colors.accentTint,
                  },
                ]}
              >
                <Text variant="caption" style={styles.chipText}>
                  {traditionInitial(reading.system)}
                </Text>
              </View>
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

        {split ? (
          <Panel inset style={styles.block}>
            <Text variant="bodyStrong">Not “balanced”</Text>
            <Text variant="caption" tone="muted" style={styles.dissent}>
              {majority.length} traditions against {minority.length} is a dissent, not a middle
              position. Torchlight never averages a disagreement into a moderate reading.
            </Text>
          </Panel>
        ) : null}

        <Text variant="label" tone="muted" style={styles.section}>
          EACH TRADITION
        </Text>

        {readings.map((reading) => (
          <Panel key={reading.system} style={styles.block}>
            <View style={styles.readingHead}>
              <Text variant="bodyStrong">{traditionName(reading.system)}</Text>
              <Text
                variant="caption"
                tone={reading.value >= 0 ? 'primary' : 'accent'}
                style={styles.readingPole}
              >
                {poleFor(reading.value, poles)}
              </Text>
            </View>
            <SourceNote>{reading.source}</SourceNote>
          </Panel>
        ))}

        <Text variant="caption" tone="subtle" style={styles.foot}>
          {poles.question}
        </Text>
      </ScrollView>
    </Screen>
  );
}

/** Which pole a reading points to. */
function poleFor(value: number, poles: { low: string; high: string }): string {
  return value >= 0 ? poles.high : poles.low;
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tally: { marginTop: 6 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 14 },
  chip: { width: 30, height: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontWeight: '800' },
  poles: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  block: { marginTop: 8 },
  dissent: { marginTop: 8 },
  section: { marginTop: 28, marginBottom: 12 },
  readingHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  readingPole: { fontWeight: '700' },
  foot: { marginTop: 20 },
});
