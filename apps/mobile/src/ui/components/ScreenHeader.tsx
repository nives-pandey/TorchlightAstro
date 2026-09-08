/**
 * Torchlight — screen header
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
 * The eyebrow, title and short rule every screen opens with.
 *
 * Repeated on ten screens, so it lives here — the 56px underline in particular
 * is the kind of measurement that drifts to 52 or 60 when each screen draws its
 * own.
 */
export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}): React.JSX.Element {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {eyebrow ? (
        <Text variant="label" tone="primary" style={styles.eyebrow}>
          {eyebrow}
        </Text>
      ) : null}

      <Text variant="display">{title}</Text>
      <View style={[styles.rule, { backgroundColor: theme.colors.rule }]} />

      {subtitle ? (
        <Text variant="body" tone="muted" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginBottom: 20 },
  eyebrow: { marginBottom: 8 },
  rule: { width: 56, height: 2, marginTop: 8 },
  subtitle: { marginTop: 12 },
});
