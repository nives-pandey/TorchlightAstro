/**
 * Torchlight — text field
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { TOUCH_TARGET } from '../theme';
import { useTheme } from '../ThemeProvider';
import { Text } from './Text';

export interface TextFieldProps extends TextInputProps {
  label: string;
  /** Shown below the field, replacing any hint. */
  error?: string | undefined;
  /** Shown below the field when there is no error. */
  hint?: string | undefined;
}

/**
 * A labelled input.
 *
 * The label is always visible rather than a placeholder that vanishes on focus.
 * A placeholder-as-label leaves someone who paused mid-form with no way to know
 * what they were typing, and is the most common accessibility failure in mobile
 * forms.
 */
export function TextField({
  label,
  error,
  hint,
  style,
  ...rest
}: TextFieldProps): React.JSX.Element {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={styles.wrapper}>
      <Text variant="label" tone="muted" style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            minHeight: TOUCH_TARGET,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radius.md,
            borderColor,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            ...theme.typography.body,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textSubtle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        {...rest}
      />

      {(error ?? hint) ? (
        <Text variant="caption" tone={error ? 'danger' : 'subtle'} style={styles.helper}>
          {error ?? hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { marginBottom: 6 },
  input: { borderWidth: 1 },
  helper: { marginTop: 6 },
});
