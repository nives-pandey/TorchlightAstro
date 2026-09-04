/**
 * Torchlight — chart overview
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import {
  DIMENSION_POLES,
  SYSTEM_NAMES,
  TROPICAL_SIGNS,
  type Chart,
  type ChartResponse,
  type DimensionSynthesis,
  type TraitReading,
} from '../api/chart-types';
import { useAuth } from '../auth/AuthProvider';
import { Button, Card, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * What a person sees when they open the app.
 *
 * The engine computes, for each of five dimensions, every tradition's reading
 * traced back to the placement that produced it — "Sun in Leo, strongly
 * outgoing" — along with how much the traditions agree and how far apart they
 * sit. An earlier version of this screen averaged all that into one dot on a
 * line, which was actively misleading: when Western reads +0.90 and Vedic reads
 * −0.60, a dot at +0.32 describes nobody. The disagreement *was* the finding,
 * and averaging destroyed it.
 *
 * So the ordering here follows what is actually known, strongest first:
 *
 *   what every tradition agrees on   — the firmest thing the chart says
 *   where they genuinely disagree    — what no single tradition can tell you
 *   each tradition's own placements  — for the reader who came for their
 *                                      nakshatra or their day master
 *
 * Every dimension opens to show its working: each system, what it read, how
 * strongly, and from which placement. A reading that cannot show where it came
 * from is indistinguishable from one that was invented.
 */
export function ChartScreen({ profileId }: { profileId: string }): React.JSX.Element {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const [chart, setChart] = useState<Chart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<ChartResponse>(`/profiles/${profileId}/chart`);
      setChart(response.chart);
      setError(null);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not load your chart. Check your connection.',
      );
    }
  }, [profileId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error && !chart) {
    return (
      <Screen>
        <View style={[styles.centred, { padding: theme.spacing.xl }]}>
          <Feather name="cloud-off" size={28} color={theme.colors.iconMuted} />
          <Text variant="body" tone="muted" style={styles.errorText}>
            {error}
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => { void load(); }} />
        </View>
      </Screen>
    );
  }

  if (!chart) {
    return (
      <Screen>
        <View style={styles.centred}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  const { synthesis, vedic, western, chinese, numerology, humanDesign, tarot } = chart;

  // Sorted so the firmest findings lead. `spread` is the standard deviation of
  // the contributing readings: low means the traditions landed close together.
  const settled = [...synthesis.agreements].sort((a, b) => a.spread - b.spread);
  const contested = [...synthesis.dimensions]
    .filter((d) => !synthesis.agreements.some((a) => a.dimension === d.dimension))
    .sort((a, b) => b.spread - a.spread);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={theme.colors.primary}
            onRefresh={() => {
              setRefreshing(true);
              void load().finally(() => setRefreshing(false));
            }}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="display">{user?.displayName ?? 'Your chart'}</Text>
            <Text variant="caption" tone="subtle" style={styles.subtitle}>
              {synthesis.systems.length} traditions compared, {settled.length} in full agreement
            </Text>
          </View>
          <Button label="Sign out" variant="quiet" onPress={() => { void signOut(); }} />
        </View>

        {!chart.hasBirthTime ? (
          <Card style={styles.notice}>
            <Text variant="caption" tone="muted">
              Without a birth time, your houses and rising sign are left out rather than guessed.
            </Text>
          </Card>
        ) : null}

        {settled.length > 0 ? (
          <>
            <SectionHeading
              title="What they all agree on"
              caption={
                settled.length === 1
                  ? 'One reading every tradition arrived at independently.'
                  : `${settled.length} readings every tradition arrived at independently.`
              }
            />
            {settled.map((dimension) => (
              <DimensionCard key={dimension.dimension} dimension={dimension} settled />
            ))}
          </>
        ) : null}

        {contested.length > 0 ? (
          <>
            <SectionHeading
              title="Where they disagree"
              caption="Traditions built on different premises reach different conclusions. The disagreement is a finding, not an error."
            />
            {contested.map((dimension) => (
              <DimensionCard key={dimension.dimension} dimension={dimension} settled={false} />
            ))}
          </>
        ) : null}

        <SectionHeading title="Vedic" />
        <Card style={styles.card}>
          <Detail label="Moon sign" value={vedic.moonRashi.name} />
          <Detail
            label="Nakshatra"
            value={`${vedic.moonNakshatra.name} · pada ${vedic.moonNakshatra.pada}`}
          />
          {vedic.ascendantRashi ? (
            <Detail label="Ascendant" value={vedic.ascendantRashi.name} />
          ) : null}
          {vedic.currentDasha ? (
            <Detail
              label="Current period"
              value={`${vedic.currentDasha.mahadasha.planet} · to ${formatYear(
                vedic.currentDasha.mahadasha.end,
              )}`}
            />
          ) : null}
          {vedic.currentDasha?.antardasha ? (
            <Detail
              label="Within it"
              value={`${vedic.currentDasha.antardasha.planet} · to ${formatYear(
                vedic.currentDasha.antardasha.end,
              )}`}
            />
          ) : null}
          <Detail
            label="Tithi"
            value={`${vedic.panchanga.tithi.name} · ${vedic.panchanga.tithi.paksha} paksha`}
            last
          />
        </Card>

        <SectionHeading title="Western" />
        <Card style={styles.card}>
          {western.planets.slice(0, 3).map((planet, index) => (
            <Detail
              key={planet.name}
              label={planet.name}
              value={`${TROPICAL_SIGNS[planet.signIndex] ?? ''}${
                planet.house ? ` · house ${planet.house}` : ''
              }`}
              last={index === 2}
            />
          ))}
        </Card>

        <SectionHeading title="Chinese" />
        <Card style={styles.card}>
          <Detail
            label="Day master"
            value={`${chinese.dayMaster.yang ? 'Yang' : 'Yin'} ${chinese.dayMaster.element} · ${
              chinese.dayMaster.pinyin
            }`}
          />
          <Detail label="Year" value={`${chinese.year.pinyin} · ${chinese.year.ganZhi}`} />
          <Detail label="Day" value={`${chinese.day.pinyin} · ${chinese.day.ganZhi}`} last />
        </Card>

        {numerology ? (
          <>
            <SectionHeading title="Numerology" />
            <Card style={styles.card}>
              <Detail label="Life path" value={String(numerology.lifePath)} />
              <Detail label="Expression" value={String(numerology.expression)} />
              <Detail label="Soul urge" value={String(numerology.soulUrge)} last />
            </Card>
          </>
        ) : null}

        <SectionHeading title="Human Design" />
        <Card style={styles.card}>
          <Detail label="Profile" value={humanDesign.profile} />
          <Detail
            label="Sun gate"
            value={`${humanDesign.personalitySun.gate}.${humanDesign.personalitySun.line}`}
            last
          />
        </Card>

        <SectionHeading title="Tarot" />
        <Card style={styles.card}>
          <Detail label="Birth card" value={tarot.primary.name} last />
        </Card>
      </ScrollView>
    </Screen>
  );
}

function SectionHeading({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text variant="label" tone="muted">
        {title.toUpperCase()}
      </Text>
      {caption ? (
        <Text variant="caption" tone="subtle" style={styles.sectionCaption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * One dimension, stated as a sentence and openable to show its working.
 *
 * The headline is the claim in plain words. Tapping reveals every contributing
 * reading — which tradition, how strongly, and from which placement — because a
 * claim that cannot show its source is indistinguishable from an invented one.
 */
function DimensionCard({
  dimension,
  settled,
}: {
  dimension: DimensionSynthesis;
  settled: boolean;
}): React.JSX.Element {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const poles = DIMENSION_POLES[dimension.dimension];
  const readings = [...dimension.readings].sort((a, b) => b.value - a.value);

  // For a contested dimension the two camps are the story, so name them.
  const majority = dimension.consensus >= 0 ? poles.high : poles.low;
  const minority = dimension.consensus >= 0 ? poles.low : poles.high;
  const withMajority = readings.filter((r) =>
    dimension.consensus >= 0 ? r.value > 0 : r.value < 0,
  );
  const withMinority = readings.filter((r) =>
    dimension.consensus >= 0 ? r.value < 0 : r.value > 0,
  );

  return (
    <Card
      style={styles.card}
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpen((previous) => !previous);
      }}
      accessibilityLabel={`${poles.question} ${dimension.pole ?? 'Balanced'}. Tap to see each tradition's reading.`}
    >
      <View style={styles.dimensionHead}>
        <View style={styles.dimensionHeadText}>
          <Text variant="caption" tone="subtle">
            {poles.question}
          </Text>
          <Text variant="title" style={styles.dimensionClaim}>
            {dimension.pole ?? 'Balanced'}
          </Text>
        </View>
        <Feather
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.iconMuted}
        />
      </View>

      {settled ? (
        <Text variant="caption" tone="muted">
          All {dimension.readings.length} traditions that read this agree.
        </Text>
      ) : (
        <Text variant="caption" tone="muted">
          {namesOf(withMajority)} read you as {majority.toLowerCase()};{' '}
          {namesOf(withMinority)} {withMinority.length === 1 ? 'reads' : 'read'} you as{' '}
          {minority.toLowerCase()}.
        </Text>
      )}

      {open ? (
        <View style={[styles.workings, { borderTopColor: theme.colors.border }]}>
          {readings.map((reading) => (
            <ReadingRow key={reading.system} reading={reading} poles={poles} />
          ))}
        </View>
      ) : null}
    </Card>
  );
}

/** One tradition's reading, with the placement it came from. */
function ReadingRow({
  reading,
  poles,
}: {
  reading: TraitReading;
  poles: { low: string; high: string };
}): React.JSX.Element {
  const theme = useTheme();

  const pole = reading.value >= 0 ? poles.high : poles.low;
  const strength = Math.abs(reading.value);
  const qualifier = strength >= 0.6 ? 'strongly ' : strength >= 0.3 ? '' : 'slightly ';

  return (
    <View style={styles.reading}>
      <View style={styles.readingHead}>
        <Text variant="bodyStrong">{SYSTEM_NAMES[reading.system] ?? reading.system}</Text>
        <Text variant="caption" tone="muted">
          {qualifier}
          {pole.toLowerCase()}
        </Text>
      </View>
      <Text variant="caption" tone="subtle">
        {reading.source}
      </Text>

      {/* The bar is the reading's own strength, not an average — so a firm
          reading and a faint one cannot look alike. */}
      <View
        style={[
          styles.readingTrack,
          { backgroundColor: theme.colors.surface2, borderRadius: theme.radius.pill },
        ]}
      >
        <View
          style={[
            styles.readingFill,
            {
              backgroundColor:
                reading.confidence === 'indicative' ? theme.colors.borderStrong : theme.colors.primary,
              width: `${Math.max(strength, 0.04) * 100}%`,
              borderRadius: theme.radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
}

/** Joins system names into readable prose: "Western, Vedic and Chinese". */
function namesOf(readings: readonly TraitReading[]): string {
  const names = readings.map((r) => SYSTEM_NAMES[r.system] ?? r.system);
  if (names.length === 0) return 'No tradition';
  if (names.length === 1) return names[0] as string;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] as string}`;
}

function Detail({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}): React.JSX.Element {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.detail,
        last
          ? null
          : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
      ]}
    >
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

/** Year only — a dasha runs for years, so a full date implies false precision. */
function formatYear(iso: string): string {
  return new Date(iso).getFullYear().toString();
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { textAlign: 'center', marginVertical: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerText: { flex: 1 },
  subtitle: { marginTop: 4 },
  notice: { marginTop: 16 },
  section: { marginTop: 34, marginBottom: 12 },
  sectionCaption: { marginTop: 6 },
  card: { marginBottom: 10 },
  dimensionHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  dimensionHeadText: { flex: 1 },
  dimensionClaim: { marginTop: 2, marginBottom: 6 },
  workings: { marginTop: 16, paddingTop: 4, borderTopWidth: StyleSheet.hairlineWidth },
  reading: { marginTop: 14 },
  readingHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  readingTrack: { height: 3, marginTop: 8, overflow: 'hidden' },
  readingFill: { height: 3 },
  detail: { paddingVertical: 10 },
});
