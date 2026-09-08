/**
 * Torchlight — source note
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

/**
 * Where a claim came from.
 *
 * This is the product, not a footnote. A reading that cannot name the placement
 * behind it is indistinguishable from one that was invented, and the whole
 * engine exists so that every line on screen can point at something verified.
 */
export function SourceNote({ children }: { children: React.ReactNode }): React.JSX.Element {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="label" tone="subtle" style={styles.label}>
        Source
      </Text>
      <Text variant="caption" tone="subtle" style={[styles.body, { color: theme.colors.textSubtle }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 12 },
  label: { marginBottom: 4 },
  body: { lineHeight: 17 },
});
