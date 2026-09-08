/**
 * Torchlight — splash
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ENGINE_LABEL, VERSION_LABEL } from '../version';
import { Text } from '../ui/components';

/**
 * What a returning person sees while the stored session is checked.
 *
 * Merlot rather than the parchment ground every other screen uses: this is the
 * one moment the app is allowed to be a brand rather than a tool, and it lasts
 * under a second. Nothing here is interactive, so there is nothing to mistake
 * for a sign-in prompt while the session resolves.
 */
export function SplashScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* The gold mark above the wordmark. */}
        <View style={styles.mark} />

        <Text variant="wordmark" style={styles.wordmark}>
          TORCH{'\n'}LIGHT
        </Text>

        <Text variant="body" style={styles.tagline}>
          Ten traditions read one birth chart. Every claim shows its source.
        </Text>

        <View style={styles.rule} />

        <View style={styles.meta}>
          <Text variant="label" style={styles.metaText}>
            {VERSION_LABEL}
          </Text>
          <Text variant="label" style={styles.metaText}>
            {ENGINE_LABEL}
          </Text>
        </View>
      </View>
    </View>
  );
}

const MERLOT = '#722F37';
const CREAM = '#F7F2EC';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: MERLOT },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 28, paddingBottom: 40 },
  mark: { width: 64, height: 4, backgroundColor: '#B89B4C', marginBottom: 20 },
  wordmark: { color: CREAM, marginBottom: 20 },
  tagline: { color: CREAM, fontSize: 17, lineHeight: 23, maxWidth: 300, marginBottom: 28 },
  rule: { height: 2, backgroundColor: CREAM, marginBottom: 10 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { color: CREAM },
});
