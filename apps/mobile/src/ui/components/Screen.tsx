/**
 * Torchlight — screen container
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../ThemeProvider';

export interface ScreenProps {
  children: ReactNode;
  /** Scrolls when the content is taller than the viewport. */
  scroll?: boolean;
  /** Lifts content above the keyboard. Set on any screen with a text input. */
  avoidKeyboard?: boolean;
}

/**
 * Every screen sits inside this.
 *
 * It owns the ground colour, the safe-area insets and the status-bar style, so
 * no screen sets them and none can forget to. The status bar in particular is
 * easy to miss: get it wrong and dark icons sit on a dark ground, which looks
 * like a rendering fault rather than a styling slip.
 */
export function Screen({
  children,
  scroll = false,
  avoidKeyboard = false,
}: ScreenProps): React.JSX.Element {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const content = scroll ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.fill}>{children}</View>
  );

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.bg }, padding]}>
      {/*
        No backgroundColor prop: React Native 0.87 removed it, since Android 15
        enforces edge-to-edge and the system bar is drawn over the app's own
        background. The view behind it supplies the colour instead.
      */}
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
