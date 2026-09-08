/**
 * Torchlight — stone and colour
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
 * What the tradition prescribes, and the rule it followed.
 *
 * These are prescriptions rather than readings, which is a real difference: a
 * reading describes, a prescription tells someone to do something. So the rule
 * behind each one is shown plainly enough to disagree with, and the disclaimer
 * at the foot is not boilerplate — people act on this.
 */

/** Why a stone was chosen, in words rather than as a key. */
const BASIS: Readonly<Record<string, string>> = {
  'ascendant-ruler': 'rules your rising sign',
  'moon-sign-ruler': 'rules your Moon sign',
  'current-dasha': 'rules the period running now',
  'day-master-phase': 'is your Chinese day master',
};

export function StoneColourScreen({
  chart,
  onBack,
}: {
  chart: Chart;
  onBack: () => void;
}): React.JSX.Element {
  const theme = useTheme();

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
          eyebrow="Prescriptions, not readings"
          title="Stone & colour"
        />

        <Text variant="label" tone="muted" style={styles.section}>
          STONES
        </Text>

        {chart.gemstones.map((entry) => (
          <Panel key={`${entry.basis}-${entry.gemstone.stone}`} style={styles.block}>
            <Text variant="title">{entry.gemstone.stone}</Text>
            <Text variant="caption" tone="muted" style={styles.sanskrit}>
              {entry.gemstone.sanskrit}
            </Text>

            <View style={styles.specs}>
              <Spec label="Setting" value={entry.gemstone.metal} />
              <Spec label="Finger" value={entry.gemstone.finger} />
              <Spec label="Day to start" value={entry.gemstone.day} />
            </View>

            <SourceNote>
              {entry.gemstone.graha} {BASIS[entry.basis] ?? entry.basis} · the traditional
              stone for {entry.gemstone.graha}
            </SourceNote>
          </Panel>
        ))}

        <Text variant="label" tone="muted" style={styles.section}>
          COLOURS
        </Text>

        <Panel>
          <View style={styles.swatches}>
            {chart.colours.map((entry) => (
              <View key={`${entry.basis}-${entry.colour.name}`} style={styles.swatchCell}>
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: entry.colour.hex, borderColor: theme.colors.rule },
                  ]}
                />
                <Text variant="caption" style={styles.swatchName}>
                  {entry.colour.name}
                </Text>
              </View>
            ))}
          </View>

          <SourceNote>
            {chart.colours
              .map((entry) => `${entry.colour.name} from ${entry.source}`)
              .join(' · ')}
          </SourceNote>
        </Panel>

        <Panel inset style={styles.disclaimer}>
          <Text variant="caption" tone="muted">
            Traditional prescriptions, not medical, financial or legal advice. Torchlight shows
            the rule it applied so you can disagree with it.
          </Text>
        </Panel>
      </ScrollView>
    </Screen>
  );
}

function Spec({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.spec}>
      <Text variant="label" tone="subtle">
        {label}
      </Text>
      <Text variant="body" style={styles.specValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  section: { marginTop: 24, marginBottom: 12 },
  block: { marginTop: 8 },
  sanskrit: { marginTop: 2 },
  specs: { flexDirection: 'row', marginTop: 16 },
  spec: { flex: 1 },
  specValue: { marginTop: 4 },
  swatches: { flexDirection: 'row', gap: 12 },
  swatchCell: { flex: 1 },
  swatch: { height: 56, borderWidth: 2 },
  swatchName: { marginTop: 8 },
  disclaimer: { marginTop: 20 },
});
