/**
 * Torchlight — life area presentation
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import type { LifeAreaKey } from '../api/chart-types';
import type { Theme } from './theme';

/**
 * How each area looks, kept in one place because three screens draw them.
 *
 * The tint carries the colour and the ink sits on top of it, so an area is
 * identifiable at a glance without a filled card competing with the one gold
 * action the screen is allowed.
 */

export const AREA_ICONS: Readonly<
  Record<LifeAreaKey, 'dollar-sign' | 'briefcase' | 'heart' | 'home' | 'activity' | 'book-open' | 'layers' | 'user'>
> = {
  money: 'dollar-sign',
  work: 'briefcase',
  love: 'heart',
  home: 'home',
  health: 'activity',
  learning: 'book-open',
  depth: 'layers',
  self: 'user',
};

export interface AreaTone {
  tint: string;
  ink: string;
}

/**
 * Three accents across eight areas, assigned by what the area is about rather
 * than cycled: merlot for the areas with weight to them, teal for the calm
 * ones, gold for the material ones.
 */
export function AREA_TONES(theme: Theme): Readonly<Record<LifeAreaKey, AreaTone>> {
  const gold: AreaTone = { tint: theme.colors.primaryTint, ink: theme.colors.primaryDeep };
  const merlot: AreaTone = { tint: theme.colors.accentTint, ink: theme.colors.accentDeep };
  const teal: AreaTone = { tint: theme.colors.calmTint, ink: theme.colors.calmDeep };

  return {
    money: gold,
    work: gold,
    love: merlot,
    depth: merlot,
    home: teal,
    health: teal,
    learning: gold,
    self: merlot,
  };
}
