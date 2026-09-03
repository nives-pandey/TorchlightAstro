/**
 * Torchlight — text
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme } from '../ThemeProvider';
import type { typography } from '../theme';

type Variant = keyof typeof typography;
type Tone = 'default' | 'muted' | 'subtle' | 'primary' | 'accent' | 'danger' | 'contrast';

export interface TextProps extends RNTextProps {
  variant?: Variant;
  tone?: Tone;
}

/**
 * Every string on screen goes through here.
 *
 * Using RNText directly would mean a colour and a size chosen per call site,
 * which is how a design system erodes — not by a bad decision but by a hundred
 * small ones nobody reviewed.
 */
export function Text({
  variant = 'body',
  tone = 'default',
  style,
  ...rest
}: TextProps): React.JSX.Element {
  const theme = useTheme();

  const colour: Record<Tone, string> = {
    default: theme.colors.text,
    muted: theme.colors.textMuted,
    subtle: theme.colors.textSubtle,
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    danger: theme.colors.danger,
    contrast: theme.colors.primaryContrast,
  };

  // Composed in one expression: TextStyle's properties are readonly, so the
  // conditional parts are spread rather than assigned afterwards.
  const family =
    variant === 'display' || variant === 'title' ? theme.fonts.display : theme.fonts.body;

  const base: TextStyle = {
    ...theme.typography[variant],
    color: colour[tone],
    ...(family ? { fontFamily: family } : {}),
    ...(variant === 'label' ? { textTransform: 'uppercase' as const } : {}),
  };

  return <RNText style={[base, style]} {...rest} />;
}
