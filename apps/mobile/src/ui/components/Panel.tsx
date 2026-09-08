/**
 * Torchlight — panel
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { type ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '../ThemeProvider';

/**
 * A bordered block.
 *
 * The Modernist system draws structure with a 2px rule and a square edge rather
 * than with elevation, so this is the shape almost everything sits inside.
 * `emphasis` swaps the rule for the accent, which is how a screen marks the one
 * block that matters — the running period, the contested dimension — without
 * spending the single gold action.
 */
export interface PanelProps {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  /** Draws the border in the accent rather than the neutral rule. */
  emphasis?: boolean;
  /** Fills with the raised surface, for a block inside a block. */
  inset?: boolean;
  style?: ViewStyle;
}

export function Panel({
  children,
  onPress,
  accessibilityLabel,
  emphasis = false,
  inset = false,
  style,
}: PanelProps): React.JSX.Element {
  const theme = useTheme();

  const container: ViewStyle = {
    borderWidth: theme.rules.heavy,
    borderColor: emphasis ? theme.colors.primary : theme.colors.rule,
    backgroundColor: inset ? theme.colors.surface2 : theme.colors.surface,
    padding: theme.spacing.lg,
  };

  if (!onPress) {
    return <View style={[container, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      {...(accessibilityLabel ? { accessibilityLabel } : {})}
      style={({ pressed }) => [container, pressed && { opacity: 0.75 }, style]}
    >
      {children}
    </Pressable>
  );
}
