/**
 * Torchlight
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/auth/AuthProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/ui/ThemeProvider';

/**
 * Provider order matters: the theme wraps everything because the auth splash
 * screen already needs colours, and safe-area insets sit outermost because both
 * of the others render inside them.
 *
 * NavigationContainer sits inside auth rather than outside it, so the tab bar
 * exists only once there is a session to navigate. A signed-out person sees a
 * single screen, not an empty shell with tabs along the bottom.
 */
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
