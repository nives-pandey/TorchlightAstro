/**
 * Torchlight — card
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

export interface CardProps {
  children: ReactNode;
  /** When given, the whole card becomes the touch target. */
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * A raised surface.
 *
 * Bordered rather than shadowed. On a parchment ground a shadow reads as grime,
 * and a hairline border gives the same separation without the muddiness.
 */
export function Card({
  children,
  onPress,
  accessibilityLabel,
  style,
}: CardProps): React.JSX.Element {
  const theme = useTheme();

  const container: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
      style={({ pressed }) => [container, pressed && { opacity: 0.7 }, style]}
    >
      {children}
    </Pressable>
  );
}
