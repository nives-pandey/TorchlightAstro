/**
 * Torchlight — button
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { TOUCH_TARGET } from '../theme';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'quiet';

export interface ButtonProps {
  /** One word where one word will do. "Continue", not "Continue to next step". */
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  /** Fills its container. Used for the single primary action on a screen. */
  block?: boolean;
  style?: ViewStyle;
}

/**
 * Three variants, deliberately.
 *
 * Primary is gold and there is one per screen. Secondary is outlined, for the
 * alternative that is still a real choice. Quiet is text only, for the escape
 * hatch — "Skip", "Not now" — which must be available without competing.
 *
 * A fourth variant would mean the hierarchy had stopped being a hierarchy.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  block = false,
  style,
}: ButtonProps): React.JSX.Element {
  const theme = useTheme();
  const inactive = disabled || loading;

  // Built as one object rather than mutated after: ViewStyle's properties are
  // readonly, and spreading keeps each variant's difference visible in one place.
  const variantStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: theme.colors.primary }
      : variant === 'secondary'
        ? { borderWidth: 1, borderColor: theme.colors.borderStrong }
        : {};

  const container: ViewStyle = {
    minHeight: TOUCH_TARGET,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: block ? 'stretch' : 'flex-start',
    opacity: inactive ? 0.45 : 1,
    ...variantStyle,
  };

  const tone = variant === 'primary' ? 'contrast' : variant === 'quiet' ? 'muted' : 'default';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      // Pressed feedback is a subtle dim rather than a scale or a colour shift.
      // Movement on press reads as playful, which is wrong for this product.
      style={({ pressed }) => [container, pressed && !inactive && styles.pressed, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.primaryContrast : theme.colors.primary}
        />
      ) : (
        <View>
          <Text variant="bodyStrong" tone={tone}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
});
