/**
 * Torchlight — birth details
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { ApiError, api } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { Screen, Text, TextField } from '../ui/components';
import { useTheme } from '../ui/ThemeProvider';

export interface Place {
  id: number;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

/** How well the person knows their birth time. */
type Certainty = 'exact' | 'within15' | 'unknown';

/**
 * Where a person enters their birth.
 *
 * Two things here are load-bearing.
 *
 * The place field, because a plain text search fails for Indian villages, where
 * transliteration has no canonical spelling — a village its residents call
 * "Lodhwariya" is stored as "Lodhauria", and neither exact nor fuzzy matching
 * finds it. Choosing a place offers the settlements around it, so a person
 * reaches their village by narrowing from the town they know.
 *
 * And the time certainty, because "unknown" is a different answer from a guess.
 * Someone who half-remembers an afternoon birth should not have that recorded
 * as 14:30 exactly, and the chart is honest about what it cannot compute.
 */
export function BirthDetailsScreen({ onSaved }: { onSaved: () => void }): React.JSX.Element {
  const theme = useTheme();
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [certainty, setCertainty] = useState<Certainty>('exact');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [nearby, setNearby] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (text: string): Promise<void> => {
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      setResults(await api.get<Place[]>(`/places/search?q=${encodeURIComponent(text.trim())}`));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced: a request per keystroke would spend the shared GeoNames quota
  // and arrive out of order.
  useEffect(() => {
    if (place) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { void search(query); }, 350);

    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, place, search]);

  const choosePlace = async (chosen: Place): Promise<void> => {
    setPlace(chosen);
    setResults([]);
    setQuery(chosen.name);

    try {
      setNearby(
        await api.get<Place[]>(
          `/places/nearby?lat=${chosen.latitude}&lng=${chosen.longitude}&radius=20`,
        ),
      );
    } catch {
      setNearby([]);
    }
  };

  /**
   * Pads a single-digit hour, so "9:30" becomes "09:30".
   *
   * The server requires HH:MM and rejects "9:30", which is a perfectly natural
   * thing to type. Correcting it here is kinder than refusing it, and safer
   * than loosening the schema — the engine's whole contract is that a time is
   * unambiguous.
   */
  const normalisedTime = (): string => {
    const raw = time.trim();
    const [hours, minutes] = raw.split(':');
    if (hours === undefined || minutes === undefined) return raw;
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const save = async (): Promise<void> => {
    if (!place) return;

    setBusy(true);
    setError(null);

    try {
      await api.post('/profiles', {
        displayName: user?.displayName ?? 'My chart',
        birthDate: date.trim(),
        // An unknown time is sent as absent rather than as a guess, so the
        // engine omits houses instead of computing wrong ones.
        ...(certainty !== 'unknown' && time.trim() ? { birthTime: normalisedTime() } : {}),
        placeName: [place.name, place.region, place.country].filter(Boolean).join(', '),
        countryCode: place.countryCode,
        timezone: place.timezone,
        latitude: place.latitude,
        longitude: place.longitude,
        isSelf: true,
      });
      onSaved();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Could not save. Check your connection.');
    } finally {
      setBusy(false);
    }
  };

  const ready =
    /^\d{4}-\d{2}-\d{2}$/.test(date.trim()) &&
    place !== null &&
    (certainty === 'unknown' || /^\d{1,2}:\d{2}$/.test(time.trim()));

  return (
    <Screen scroll avoidKeyboard>
      <View style={[styles.content, { padding: theme.spacing.lg + 4 }]}>
        <Text variant="display">Birth details</Text>
        <View style={[styles.underline, { backgroundColor: theme.colors.rule }]} />

        <TextField
          label="Date of birth"
          value={date}
          onChangeText={setDate}
          placeholder="1990-08-15"
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
        />

        {certainty !== 'unknown' ? (
          <TextField
            label="Time"
            value={time}
            onChangeText={setTime}
            placeholder="14:30"
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
            hint="24-hour clock"
          />
        ) : null}

        <Text variant="label" tone="muted" style={styles.groupLabel}>
          How sure are you of the time?
        </Text>
        <View style={styles.segments}>
          {(
            [
              ['exact', 'Exact'],
              ['within15', 'Within 15 min'],
              ['unknown', 'Unknown'],
            ] as const
          ).map(([value, label]) => {
            const selected = certainty === value;
            return (
              <Pressable
                key={value}
                onPress={() => setCertainty(value)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[
                  styles.segment,
                  selected ? { backgroundColor: theme.colors.primary } : styles.segmentIdle,
                  { borderColor: theme.colors.rule },
                ]}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.segmentLabel,
                    { color: selected ? theme.colors.primaryContrast : theme.colors.text },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextField
          label="Place of birth"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setPlace(null);
            setNearby([]);
          }}
          placeholder="Town or city"
          autoCorrect={false}
        />

        {searching ? (
          <ActivityIndicator color={theme.colors.primary} style={styles.spinner} />
        ) : null}

        {results.map((result) => (
          <PlaceRow key={result.id} place={result} onPress={() => { void choosePlace(result); }} />
        ))}

        {place ? (
          <View style={[styles.chosen, { borderColor: theme.colors.rule }]}>
            <View style={styles.chosenRow}>
              <Feather name="map-pin" size={16} color={theme.colors.primary} />
              <View style={styles.chosenText}>
                <Text variant="bodyStrong">{place.name}</Text>
                <Text variant="caption" tone="subtle">
                  {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E ·{' '}
                  {place.timezone}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {nearby.length > 0 ? (
          <View style={styles.nearby}>
            <Text variant="label" tone="muted" style={styles.groupLabel}>
              Nearby
            </Text>
            {nearby.slice(0, 8).map((option) => (
              <PlaceRow
                key={option.id}
                place={option}
                onPress={() => {
                  setPlace(option);
                  setQuery(option.name);
                  setNearby([]);
                }}
              />
            ))}
          </View>
        ) : null}

        <View style={[styles.why, { borderColor: theme.colors.rule }]}>
          <Text variant="label" tone="primary">
            Why the time matters
          </Text>
          <Text variant="caption" tone="muted" style={styles.whyBody}>
            Your rising sign, the sixteen divisional charts and the quarter of your moon star
            all move with the clock. Eight minutes can change them.
          </Text>
        </View>

        {error ? (
          <View style={[styles.error, { backgroundColor: theme.colors.dangerSurface }]}>
            <Text variant="caption" tone="danger">
              {error}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => { void save(); }}
          disabled={!ready || busy}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.submit,
            {
              backgroundColor: ready ? theme.colors.primary : theme.colors.surface2,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            variant="bodyStrong"
            style={[
              styles.submitLabel,
              { color: ready ? theme.colors.primaryContrast : theme.colors.textSubtle },
            ]}
          >
            {busy ? 'Reading…' : 'Read my chart'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function PlaceRow({ place, onPress }: { place: Place; onPress: () => void }): React.JSX.Element {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${place.name}, ${place.region}`}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.colors.border, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <View style={styles.rowText}>
        <Text variant="body">{place.name}</Text>
        <Text variant="caption" tone="subtle">
          {[place.region, place.country].filter(Boolean).join(', ')}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={theme.colors.iconMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  underline: { width: 56, height: 2, marginTop: 8, marginBottom: 24 },
  groupLabel: { marginTop: 16, marginBottom: 10 },
  segments: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  segment: {
    flex: 1,
    height: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIdle: { backgroundColor: 'transparent' },
  segmentLabel: { fontWeight: '700' },
  submitLabel: { fontWeight: '800' },
  spinner: { marginVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  rowText: { flex: 1 },
  chosen: { borderWidth: 2, padding: 12, marginTop: 8 },
  chosenRow: { flexDirection: 'row', alignItems: 'center' },
  chosenText: { marginLeft: 10, flex: 1 },
  nearby: { marginTop: 8 },
  why: { borderWidth: 2, padding: 14, marginTop: 24 },
  whyBody: { marginTop: 8 },
  error: { padding: 12, marginTop: 16 },
  submit: { height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
});
