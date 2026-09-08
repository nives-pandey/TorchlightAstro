/**
 * Torchlight — tab navigation
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';

import { ChartScreen } from '../screens/ChartScreen';
import { LifeAreasScreen } from '../screens/LifeAreasScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { YouScreen } from '../screens/YouScreen';
import { fontFamilyForWeight } from '../ui/theme';
import { useTheme } from '../ui/ThemeProvider';

/**
 * The five places the app goes.
 *
 * A tab bar rather than a stack because these are destinations rather than
 * steps: a person moves between what is happening now, their chart, and the
 * parts of their life in no particular order, and none of them is "back" from
 * another.
 */

export type TabParamList = {
  Today: undefined;
  Chart: undefined;
  Life: undefined;
  Timeline: undefined;
  You: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * The profile every tab reads.
 *
 * Passed through context rather than as a prop because the navigator wants
 * stable component references: an inline `{() => <Screen profileId={id} />}`
 * child is a new component type on every render, and React responds by
 * unmounting the tab and remounting it — losing scroll position and forcing a
 * refetch each time the theme or a parent state changes.
 */
const ProfileContext = createContext<string | null>(null);

function useProfileId(): string {
  const id = useContext(ProfileContext);
  if (id === null) throw new Error('useProfileId must be used inside TabNavigator');
  return id;
}

function TodayTab(): React.JSX.Element {
  return <TodayScreen profileId={useProfileId()} />;
}
function ChartTab(): React.JSX.Element {
  return <ChartScreen profileId={useProfileId()} />;
}
function LifeTab(): React.JSX.Element {
  return <LifeAreasScreen profileId={useProfileId()} />;
}
function TimelineTab(): React.JSX.Element {
  return <TimelineScreen profileId={useProfileId()} />;
}

const ICONS: Record<keyof TabParamList, 'sun' | 'circle' | 'compass' | 'clock' | 'user'> = {
  Today: 'sun',
  Chart: 'circle',
  Life: 'compass',
  Timeline: 'clock',
  You: 'user',
};

export function TabNavigator({ profileId }: { profileId: string }): React.JSX.Element {
  const theme = useTheme();
  const profile = useMemo(() => profileId, [profileId]);

  return (
    <ProfileContext.Provider value={profile}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fontFamilyForWeight['500'],
          letterSpacing: 0.2,
        },
        // React Navigation's own API for this is a render prop, and unlike a
        // screen the icon holds no state, so remounting it costs nothing.
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color }) => (
          <Feather name={ICONS[route.name]} size={20} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Today" component={TodayTab} />
      <Tab.Screen name="Chart" component={ChartTab} />
      <Tab.Screen name="Life" component={LifeTab} />
      <Tab.Screen name="Timeline" component={TimelineTab} />
      <Tab.Screen name="You" component={YouScreen} />
    </Tab.Navigator>
    </ProfileContext.Provider>
  );
}
