/**
 * Torchlight — settings
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

import { Panel, Screen, ScreenHeader, Text } from '../ui/components';
import { ENGINE_LABEL } from '../version';
import { useTheme } from '../ui/ThemeProvider';

/**
 * What a person can change, and what they cannot.
 *
 * The house system genuinely switches and recomputes the chart. The sidereal
 * offset does not — the engine is verified against Swiss Ephemeris on Lahiri,
 * and offering four ayanamsas the engine cannot honour would be a control that
 * lies. So it is stated as a fact rather than dressed as a choice.
 */
export type HouseSystem = 'placidus' | 'whole-sign';

export function SettingsScreen({
  houseSystem,
  onHouseSystemChange,
  onBack,
  onContribute,
}: {
  houseSystem: HouseSystem;
  onHouseSystemChange: (system: HouseSystem) => void;
  onBack: () => void;
  onContribute: () => void;
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
            You
          </Text>
        </Pressable>

        <ScreenHeader title="Settings" />

        <Text variant="label" tone="muted" style={styles.section}>
          HOW CHARTS ARE CALCULATED
        </Text>

        <Panel>
          <Text variant="caption" tone="muted">
            Western houses
          </Text>
          <View style={styles.segments}>
            {(
              [
                ['placidus', 'Placidus'],
                ['whole-sign', 'Whole sign'],
              ] as const
            ).map(([value, label]) => {
              const selected = houseSystem === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => onHouseSystemChange(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[
                    styles.segment,
                    selected ? { backgroundColor: theme.colors.primary } : styles.segmentIdle,
                    { borderColor: theme.colors.rule },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={[
                      styles.segmentLabel,
                      { color: selected ? theme.colors.primaryContrast : theme.colors.text },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text variant="caption" tone="subtle" style={styles.note}>
            Changing this recomputes your chart. Placidus divides by time, whole sign by sign —
            they disagree most at high latitudes.
          </Text>
        </Panel>

        <Panel style={styles.block}>
          <Fact label="Sidereal offset" value="Lahiri" />
          <Fact label="Vedic houses" value="Whole sign" />
          <Fact label="Engine" value={ENGINE_LABEL} last />
          <Text variant="caption" tone="subtle" style={styles.note}>
            The engine is verified against NASA JPL Horizons and Swiss Ephemeris on the Lahiri
            offset. Other offsets are not offered because the verification does not cover them.
          </Text>
        </Panel>

        <Text variant="label" tone="muted" style={styles.section}>
          SUPPORT
        </Text>

        <Panel onPress={onContribute} accessibilityLabel="Support Torchlight">
          <View style={styles.row}>
            <Text variant="body" style={styles.rowLabel}>
              Support Torchlight
            </Text>
            <Feather name="chevron-right" size={18} color={theme.colors.iconMuted} />
          </View>
        </Panel>
      </ScrollView>
    </Screen>
  );
}

function Fact({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.fact,
        last
          ? null
          : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
      ]}
    >
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  section: { marginTop: 24, marginBottom: 12 },
  block: { marginTop: 8 },
  segments: { flexDirection: 'row', gap: 8, marginTop: 10 },
  segment: { flex: 1, height: 44, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  segmentIdle: { backgroundColor: 'transparent' },
  segmentLabel: { fontWeight: '700' },
  note: { marginTop: 12, lineHeight: 17 },
  fact: { paddingVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { flex: 1 },
});
