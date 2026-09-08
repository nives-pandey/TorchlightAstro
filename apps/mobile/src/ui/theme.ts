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
  /** Gold at text contrast, for a label on the page ground. */
  primaryDeep: string;
  /** Gold at surface strength, for an icon tile behind a gold glyph. */
  primaryTint: string;
  primaryContrast: string;
  /** Weight and emphasis, not error. */
  accent: string;
  accentDeep: string;
  accentTint: string;
  /** The third life-area colour. Calm rather than urgent. */
  calm: string;
  calmDeep: string;
  calmTint: string;
  /** Hairline rules that carry structure rather than separation. */
  rule: string;
  /** Genuine errors only. */
  danger: string;
  dangerSurface: string;
  success: string;
  successSurface: string;
};

export const lightColors: ThemeColors = {
  bg: '#F5F1EC',
  surface: '#FCFAF7',
  surface2: '#EFEAE6',
  text: '#2E2A27',
  textMuted: '#5C5651',
  textSubtle: '#7D7875',
  border: '#DDD5CC',
  borderStrong: '#DDD5CC',
  rule: '#2E2A27',
  icon: '#2E2A27',
  iconMuted: '#7D7875',
  primary: '#B89B4C',
  primaryDeep: '#8A7134',
  primaryTint: '#F0E6CC',
  primaryContrast: '#2E2A27',
  accent: '#722F37',
  accentDeep: '#722F37',
  accentTint: '#F1DFE1',
  calm: '#4A7373',
  calmDeep: '#3A5C5C',
  calmTint: '#DEEAEA',
  danger: '#A8442A',
  dangerSurface: '#F7E9E4',
  success: '#4A7373',
  successSurface: '#DEEAEA',
};

export const darkColors: ThemeColors = {
  bg: '#2B2724',
  surface: '#36312E',
  surface2: '#413B37',
  text: '#F2EDE7',
  textMuted: '#C3BCB4',
  textSubtle: '#938C85',
  border: '#56504B',
  borderStrong: '#56504B',
  rule: '#F2EDE7',
  icon: '#F2EDE7',
  iconMuted: '#938C85',
  primary: '#C5A55A',
  primaryDeep: '#D9BE7B',
  primaryTint: '#4A4028',
  primaryContrast: '#2E2A27',
  accent: '#C48B93',
  accentDeep: '#D6A6AC',
  accentTint: '#4E3034',
  calm: '#8FB5B5',
  calmDeep: '#A8C7C7',
  calmTint: '#2E4747',
  danger: '#D98A6A',
  dangerSurface: '#4A3530',
  success: '#8FB5B5',
  successSurface: '#2E4747',
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
  display: 'Archivo' as string | undefined,
  body: 'Archivo' as string | undefined,
} as const;

/**
 * Weight to font file, for Android.
 *
 * Android resolves a font by family plus style name rather than by a numeric
 * weight, so asking for `fontWeight: '600'` on a family with one registered
 * face silently renders the only face there is. Naming the face directly is
 * what makes the weights actually differ on device.
 */
export const fontFamilyForWeight: Readonly<Record<string, string>> = {
  '400': 'Archivo-Regular',
  '500': 'Archivo-Medium',
  '600': 'Archivo-SemiBold',
  '700': 'Archivo-Bold',
};

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
