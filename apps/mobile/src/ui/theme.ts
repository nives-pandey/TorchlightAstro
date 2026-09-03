/**
 * Torchlight — design tokens
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

/**
 * Torchlight — gold and merlot on parchment.
 *
 * The palette is carried over from the previous build's design system, which
 * was the one part of it worth keeping. Three decisions from that work hold:
 *
 *   **Parchment, not white.** The ground is a warm off-white (#FCFBF9) with a
 *   slightly darker card surface (#F5F2F0). Pure white reads as clinical, and
 *   the product is meant to feel like a quiet room rather than a dashboard.
 *
 *   **Gold means action, and nothing else is gold.** One primary action per
 *   screen. The moment a second element borrows the accent, neither reads as
 *   the thing to press.
 *
 *   **Merlot is for weight, not for danger.** It marks something significant —
 *   a tension between traditions, an emphasis in a reading — where a red would
 *   imply an error.
 *
 * Both themes ship. A person checks their chart in bed at night and on a train
 * in daylight, and retrofitting the second theme later means touching every
 * screen twice.
 */

export type ThemeColors = {
  /** Page ground. */
  bg: string;
  /** Raised surface — cards, sheets, inputs. */
  surface: string;
  /** A second level of raise, used sparingly. */
  surface2: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderStrong: string;
  icon: string;
  iconMuted: string;
  /** The single accent. Gold means action. */
  primary: string;
  primaryContrast: string;
  /** Weight and emphasis, not error. */
  accent: string;
  /** Genuine errors only. */
  danger: string;
  dangerSurface: string;
  success: string;
  successSurface: string;
};

/** Gold, the signature. Shared by both themes so the brand does not drift. */
const GOLD_LIGHT = '#B89B4C';
/** Lifted for the dark ground, where the light gold loses contrast. */
const GOLD_DARK = '#C5A55A';

export const lightColors: ThemeColors = {
  bg: '#FCFBF9', // Alabaster
  surface: '#F5F2F0', // Parchment
  surface2: '#EFEAE6',
  text: '#36312E', // Warm charcoal — never pure black on a warm ground
  textMuted: '#7D7875',
  textSubtle: '#A29B96',
  border: '#E6E2DE',
  borderStrong: '#D6D0CA',
  icon: '#36312E',
  iconMuted: '#7D7875',
  primary: GOLD_LIGHT,
  primaryContrast: '#FFFFFF',
  accent: '#722F37', // Merlot
  danger: '#A8442A',
  dangerSurface: '#F7E9E4',
  success: '#4A7373',
  successSurface: '#E6EFEF',
};

export const darkColors: ThemeColors = {
  bg: '#36312E', // Warm charcoal, not cold black
  surface: '#3D3835',
  surface2: '#45403C',
  text: '#F5F2F0',
  textMuted: '#B0A9A4',
  textSubtle: '#8A837E',
  border: '#45403C',
  borderStrong: '#544E49',
  icon: '#F5F2F0',
  iconMuted: '#B0A9A4',
  primary: GOLD_DARK,
  primaryContrast: '#2A2624',
  accent: '#C48B93', // Merlot lifted for legibility on a dark ground
  danger: '#D98A6A',
  dangerSurface: '#4A3530',
  success: '#6A9797',
  successSurface: '#2F3D3D',
};

/**
 * Spacing scale, in points.
 *
 * A four-point base. Every margin and padding comes from here, so vertical
 * rhythm holds without anyone eyeballing it per screen.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

/**
 * Typography.
 *
 * Lora for display, Montserrat for interface — the pairing from the previous
 * design system. A serif for the things a person reads slowly, a clean sans for
 * the things they act on.
 *
 * The families are declared but not yet bundled, so the platform default is
 * used until the font files are added. Naming them now means adding the files
 * is a one-line change rather than a sweep through every component.
 */
export const fonts = {
  display: undefined as string | undefined, // 'Lora' once bundled
  body: undefined as string | undefined, // 'Montserrat' once bundled
} as const;

export const typography = {
  /** Screen titles. Serif, set large and quiet. */
  display: { fontSize: 30, lineHeight: 38, fontWeight: '600' as const },
  title: { fontSize: 22, lineHeight: 30, fontWeight: '600' as const },
  heading: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  /** Uppercase labels get letter-spacing; without it they read as shouting. */
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
  },
} as const;

/**
 * Minimum touch target.
 *
 * Android's Material guidance is 48dp. Anything smaller is measurably harder to
 * hit, and the audience includes people who are not twenty-five.
 */
export const TOUCH_TARGET = 48;

export type Theme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  fonts: typeof fonts;
  isDark: boolean;
};

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  fonts,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  fonts,
  isDark: true,
};
