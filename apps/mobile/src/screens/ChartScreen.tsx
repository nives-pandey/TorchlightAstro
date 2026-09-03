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
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import { DIMENSION_POLES, type Chart, type DimensionSynthesis } from '../api/chart-types';
import { useAuth } from '../auth/AuthProvider';
import { Button, Card, Screen, Text } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

/**
 * What a person sees when they open the app.
 *
 * The ordering is the product's argument. Ten traditions read the same birth,
 * so the consensus across them comes first — that is the thing no single
 * tradition can tell you. Where they disagree comes second, shown as a real
 * finding rather than smoothed away. Each tradition's own detail follows, for
 * the person who came for their nakshatra or their day master specifically.
 */
export function ChartScreen({ profileId }: { profileId: string }): React.JSX.Element {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const [chart, setChart] = useState<Chart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      setChart(await api.get<Chart>(`/profiles/${profileId}/chart`));
      setError(null);
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Could not load your chart. Check your connection.',
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
              {synthesis.systems.length} traditions
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

        <Section title="Where they agree" />
        {synthesis.dimensions.map((dimension) => (
          <DimensionRow key={dimension.dimension} dimension={dimension} />
        ))}

        {synthesis.tensions.length > 0 ? (
          <>
            <Section title="Where they differ" />
            {synthesis.tensions.map((tension) => (
              <Card key={tension.dimension} style={styles.card}>
                <Text variant="bodyStrong">{DIMENSION_POLES[tension.dimension].question}</Text>
                <Text variant="caption" tone="muted" style={styles.tensionLine}>
                  {tension.oneSide.systems.join(', ')} read you as{' '}
                  {tension.oneSide.pole.toLowerCase()}.
                </Text>
                <Text variant="caption" tone="muted">
                  {tension.otherSide.systems.join(', ')} read you as{' '}
                  {tension.otherSide.pole.toLowerCase()}.
                </Text>
              </Card>
            ))}
          </>
        ) : null}

        <Section title="Vedic" />
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
              label="Current dasha"
              value={`${vedic.currentDasha.planet} · to ${formatYear(vedic.currentDasha.end)}`}
            />
          ) : null}
          <Detail label="Tithi" value={vedic.panchanga.tithi.name} last />
        </Card>

        <Section title="Western" />
        <Card style={styles.card}>
          {western.planets.slice(0, 3).map((planet, index) => (
            <Detail
              key={planet.name}
              label={planet.name}
              value={`${planet.sign}${planet.house ? ` · house ${planet.house}` : ''}`}
              last={index === 2}
            />
          ))}
        </Card>

        <Section title="Chinese" />
        <Card style={styles.card}>
          <Detail label="Day master" value={chinese.dayMaster} />
          <Detail label="Year" value={`${chinese.year.pinyin} · ${chinese.year.ganZhi}`} />
          <Detail label="Day" value={`${chinese.day.pinyin} · ${chinese.day.ganZhi}`} last />
        </Card>

        {numerology ? (
          <>
            <Section title="Numerology" />
            <Card style={styles.card}>
              <Detail label="Life path" value={String(numerology.lifePath)} />
              <Detail label="Expression" value={String(numerology.expression)} />
              <Detail label="Soul urge" value={String(numerology.soulUrge)} last />
            </Card>
          </>
        ) : null}

        <Section title="Human Design" />
        <Card style={styles.card}>
          <Detail label="Profile" value={humanDesign.profile} />
          <Detail
            label="Sun gate"
            value={`${humanDesign.personalitySun.gate}.${humanDesign.personalitySun.line}`}
            last
          />
        </Card>

        <Section title="Tarot" />
        <Card style={styles.card}>
          <Detail label="Birth card" value={tarot.primary.name} last />
        </Card>
      </ScrollView>
    </Screen>
  );
}

/** A labelled section break. */
function Section({ title }: { title: string }): React.JSX.Element {
  return (
    <Text variant="label" tone="muted" style={styles.section}>
      {title.toUpperCase()}
    </Text>
  );
}

/**
 * One dimension, drawn as a position on its axis.
 *
 * The bar carries the finding better than a number does: a person can see at a
 * glance whether the traditions place them near a pole or near the middle, and
 * the middle is a real answer rather than a missing one.
 */
function DimensionRow({ dimension }: { dimension: DimensionSynthesis }): React.JSX.Element {
  const theme = useTheme();
  const poles = DIMENSION_POLES[dimension.dimension];

  // −1..+1 becomes 0..1 across the track.
  const position = (dimension.consensus + 1) / 2;

  return (
    <View style={styles.dimension}>
      <View style={styles.dimensionLabels}>
        <Text variant="caption" tone="subtle">
          {poles.low}
        </Text>
        <Text variant="caption" tone="subtle">
          {poles.high}
        </Text>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: theme.colors.surface2, borderRadius: theme.radius.pill },
        ]}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`${poles.question} ${dimension.pole ?? 'Balanced'}`}
      >
        <View
          style={[
            styles.marker,
            {
              backgroundColor: theme.colors.primary,
              left: `${position * 100}%`,
            },
          ]}
        />
      </View>

      <Text variant="caption" tone="muted" style={styles.dimensionPole}>
        {dimension.pole ?? 'Balanced'}
      </Text>
    </View>
  );
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
        last ? null : { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border },
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
  section: { marginTop: 32, marginBottom: 12 },
  card: { marginBottom: 8 },
  dimension: { marginBottom: 20 },
  dimensionLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: { height: 4, justifyContent: 'center' },
  // Pulled back by half its width so it centres on the value rather than
  // starting at it.
  marker: { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6 },
  dimensionPole: { marginTop: 8, textAlign: 'center' },
  detail: { paddingVertical: 10 },
  tensionLine: { marginTop: 8, marginBottom: 2 },
});
