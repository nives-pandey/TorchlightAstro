/**
 * Torchlight — tab navigation
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';

import { ChartScreen } from '../screens/ChartScreen';
import { LifeAreasScreen } from '../screens/LifeAreasScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { YouScreen } from '../screens/YouScreen';
import type { HouseSystem } from '../screens/SettingsScreen';
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
interface TabState {
  profileId: string;
  houseSystem: HouseSystem;
  setHouseSystem: (system: HouseSystem) => void;
}

const ProfileContext = createContext<TabState | null>(null);

function useTabState(): TabState {
  const state = useContext(ProfileContext);
  if (state === null) throw new Error('useTabState must be used inside TabNavigator');
  return state;
}


function TodayTab(): React.JSX.Element {
  const { profileId, houseSystem } = useTabState();
  return <TodayScreen profileId={profileId} houseSystem={houseSystem} />;
}
function ChartTab(): React.JSX.Element {
  const { profileId, houseSystem } = useTabState();
  return <ChartScreen profileId={profileId} houseSystem={houseSystem} />;
}
function LifeTab(): React.JSX.Element {
  const { profileId, houseSystem } = useTabState();
  return <LifeAreasScreen profileId={profileId} houseSystem={houseSystem} />;
}
function TimelineTab(): React.JSX.Element {
  const { profileId, houseSystem } = useTabState();
  return <TimelineScreen profileId={profileId} houseSystem={houseSystem} />;
}
function YouTab(): React.JSX.Element {
  const { houseSystem, setHouseSystem } = useTabState();
  return <YouScreen houseSystem={houseSystem} onHouseSystemChange={setHouseSystem} />;
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
  // The house system lives here because it changes what every chart-reading tab
  // requests, not only what Settings displays.
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');

  const state = useMemo<TabState>(
    () => ({ profileId, houseSystem, setHouseSystem }),
    [profileId, houseSystem],
  );

  return (
    <ProfileContext.Provider value={state}>
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
      <Tab.Screen name="You" component={YouTab} />
    </Tab.Navigator>
    </ProfileContext.Provider>
  );
}
