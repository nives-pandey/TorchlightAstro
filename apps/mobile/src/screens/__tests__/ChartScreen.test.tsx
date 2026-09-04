/**
 * Torchlight — chart screen tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { SafeAreaProvider, type Metrics } from 'react-native-safe-area-context';

import { ChartScreen } from '../ChartScreen';
import { AuthProvider } from '../../auth/AuthProvider';
import { ThemeProvider } from '../../ui/ThemeProvider';
import fixture from './fixtures/chart-response.json';

/**
 * Renders the chart screen against a real API response.
 *
 * The fixture is a verbatim capture from the deployed API, not a hand-written
 * object. That distinction is the entire point: the response types are declared
 * by hand in the app, so nothing but a real payload can prove they match. A
 * hand-written fixture would encode the same assumptions as the types and pass
 * while the app crashed against the server.
 *
 * Four mismatches were found this way, each of which typechecked cleanly and
 * would have failed at runtime: the chart is nested under a cache envelope,
 * `currentDasha` holds a mahadasha and antardasha rather than one flat period,
 * planets carry a sign index rather than a sign name, and Chinese stems are
 * objects rather than strings — the last of which throws outright, because an
 * object cannot be rendered as a React child.
 */

const METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScreen(): Promise<ReactTestRenderer.ReactTestRenderer> {
  let tree!: ReactTestRenderer.ReactTestRenderer;

  // `act` must wrap creation so the effect that fetches the chart, and the
  // state update that follows it, are both flushed before anything is asserted.
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={METRICS}>
        <ThemeProvider>
          <AuthProvider>
            <ChartScreen profileId="test-profile" />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });

  return tree;
}

/**
 * Every string rendered anywhere in the tree, joined.
 *
 * The tree is walked rather than serialised: a rendered tree holds circular
 * references through its context providers, and only the visible text matters
 * here anyway.
 */
function textOf(tree: ReactTestRenderer.ReactTestRenderer): string {
  const found: string[] = [];

  const walk = (node: ReactTestRenderer.ReactTestRendererJSON | string | null): void => {
    if (node === null) return;
    if (typeof node === 'string') {
      found.push(node);
      return;
    }
    for (const child of node.children ?? []) walk(child);
  };

  const root = tree.toJSON();
  for (const node of Array.isArray(root) ? root : [root]) walk(node);

  return found.join('');
}

describe('the chart screen', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(async () => ({
      status: 200,
      json: async () => ({ ok: true, data: fixture }),
    })) as unknown as typeof fetch;
  });

  it('renders a real chart response without throwing', async () => {
    const tree = await renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  it('shows the placements a person came for', async () => {
    const rendered = textOf(await renderScreen());

    // Vedic: the Moon's sign and nakshatra.
    expect(rendered).toContain('Vrishabha');
    expect(rendered).toContain('Rohini');

    // Chinese: the day master, which is a stem object rather than a string.
    expect(rendered).toContain('Yang Water');

    // Human Design and tarot.
    expect(rendered).toContain('4/6');
    expect(rendered).toContain('The Lovers');

    // Western: a sign name looked up from the index the response carries.
    expect(rendered).toContain('Virgo');
  });

  it('names the running dasha and its sub-period', async () => {
    const rendered = textOf(await renderScreen());

    expect(rendered).toContain('Jupiter');
    expect(rendered).toContain('Venus');
  });

  it('states each dimension as a claim rather than a position on a line', async () => {
    const rendered = textOf(await renderScreen());

    // The question being answered, and the answer.
    expect(rendered).toContain('What do you trust when deciding?');
    expect(rendered).toContain('Feeling');
    expect(rendered).toContain('Connective');
  });

  it('separates unanimous findings from contested ones', async () => {
    const rendered = textOf(await renderScreen());

    expect(rendered).toContain('WHAT THEY ALL AGREE ON');
    expect(rendered).toContain('WHERE THEY DISAGREE');

    // A contested dimension names both camps, so the disagreement is legible
    // rather than averaged away.
    expect(rendered).toContain('read you as outgoing');
    expect(rendered).toContain('Vedic reads you as reflective');
  });

  it('names traditions in prose, not by their internal keys', async () => {
    const rendered = textOf(await renderScreen());

    expect(rendered).toContain('Human Design');
    expect(rendered).not.toContain('humanDesign');
  });

  it('reports a failure rather than rendering an empty chart', async () => {
    globalThis.fetch = jest.fn(async () => ({
      status: 500,
      json: async () => ({ ok: false, error: 'Engine unavailable', statusCode: 500 }),
    })) as unknown as typeof fetch;

    expect(textOf(await renderScreen())).toContain('Engine unavailable');
  });
});
