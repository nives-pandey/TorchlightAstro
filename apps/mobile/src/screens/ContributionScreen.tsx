/**
 * Torchlight — support
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { Panel, Screen, ScreenHeader, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * Asking, once, without pressure.
 *
 * Nothing in the app is withheld, and this screen must not imply otherwise: no
 * countdown, no "unlock", no tier that makes the free reading feel partial. It
 * states what the money pays for and gets out of the way.
 *
 * Contributions are not open yet. The choice between Google Play Billing and an
 * external processor is unresolved and Play's rules differ sharply between
 * them, so tapping through says so rather than simulating a payment — a flow
 * that ends in "thank you" would leave a tester believing they had paid.
 */

interface Tier {
  amount: string;
  note: string;
  emphasis?: boolean;
}

const TIERS: readonly Tier[] = [
  { amount: '$5', note: 'A month of ephemeris queries' },
  { amount: '$12', note: 'A quarter · most chosen', emphasis: true },
  { amount: '$45', note: 'A year, and a name in the credits' },
];

export function ContributionScreen({ onBack }: { onBack: () => void }): React.JSX.Element {
  const theme = useTheme();
  const [selected, setSelected] = useState('$12');
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg + 4, paddingBottom: theme.spacing.xxxl }}
      >
        <Pressable onPress={onBack} accessibilityRole="button" style={styles.back}>
          <Feather name="chevron-left" size={18} color={theme.colors.iconMuted} />
          <Text variant="caption" tone="muted">
            Settings
          </Text>
        </Pressable>

        <ScreenHeader
          eyebrow="Support"
          title="Nothing here is behind a paywall."
        />

        <Text variant="body" tone="muted" style={styles.blurb}>
          Ephemeris data and city lookups cost money to run. Contribute if the readings are
          worth it to you.
        </Text>

        {TIERS.map((tier) => {
          const active = selected === tier.amount;
          return (
            <Panel
              key={tier.amount}
              emphasis={active}
              style={styles.block}
              onPress={() => setSelected(tier.amount)}
              accessibilityLabel={`${tier.amount}, ${tier.note}`}
            >
              <View style={styles.tierRow}>
                <Text variant="title">{tier.amount}</Text>
                <Text variant="caption" tone="muted" style={styles.tierNote}>
                  {tier.note}
                </Text>
              </View>
            </Panel>
          );
        })}

        <Pressable
          onPress={() => setComingSoon(true)}
          accessibilityRole="button"
          accessibilityLabel={`Contribute ${selected}`}
          style={({ pressed }) => [
            styles.contribute,
            { backgroundColor: theme.colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text
            variant="bodyStrong"
            style={[styles.contributeLabel, { color: theme.colors.primaryContrast }]}
          >
            Contribute {selected}
          </Text>
        </Pressable>

        <Text variant="label" tone="muted" style={styles.section}>
          WHERE IT GOES
        </Text>
        <Panel>
          <Text variant="caption" tone="muted">
            Ephemeris data, the GeoNames place lookup, and server time.
          </Text>
        </Panel>

        <Text variant="caption" tone="subtle" style={styles.foot}>
          Contributing changes nothing about your chart. No tiers, no locked traditions, no
          upsell.
        </Text>
      </ScrollView>

      <Modal
        visible={comingSoon}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoon(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setComingSoon(false)}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <View
            style={[
              styles.sheet,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.rule },
            ]}
          >
            <Text variant="label" tone="primary">
              Coming soon
            </Text>
            <Text variant="title" style={styles.sheetTitle}>
              Contributions are not open yet
            </Text>
            <Text variant="caption" tone="muted" style={styles.sheetBody}>
              Nothing in Torchlight is withheld in the meantime — every tradition, every
              reading and every chart is already yours.
            </Text>

            <Pressable
              onPress={() => setComingSoon(false)}
              accessibilityRole="button"
              style={[styles.sheetButton, { backgroundColor: theme.colors.primary }]}
            >
              <Text
                variant="bodyStrong"
                style={[styles.contributeLabel, { color: theme.colors.primaryContrast }]}
              >
                Close
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  blurb: { marginBottom: 16 },
  block: { marginTop: 8 },
  tierRow: { flexDirection: 'row', alignItems: 'baseline' },
  tierNote: { flex: 1, marginLeft: 12 },
  contribute: { height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  contributeLabel: { fontWeight: '800' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(46, 42, 39, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: { width: '100%', borderWidth: 2, padding: 20 },
  sheetTitle: { marginTop: 8 },
  sheetBody: { marginTop: 10, lineHeight: 17 },
  sheetButton: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  section: { marginTop: 24, marginBottom: 12 },
  foot: { marginTop: 16, lineHeight: 17 },
});
