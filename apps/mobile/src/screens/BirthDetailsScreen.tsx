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
import { Button, Card, Screen, Text, TextField } from '../ui/components';
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

interface BirthProfile {
  id: string;
}

/**
 * Where a person enters their birth.
 *
 * The place field is the interesting part. A plain text search fails for Indian
 * villages, where transliteration has no canonical spelling — a village a
 * person calls "Lodhwariya" is stored as "Lodhauria", and neither exact nor
 * fuzzy matching finds it. So once a place is chosen, nearby settlements are
 * offered: pick the town you know, then narrow to the village.
 *
 * That also happens to be how someone describes where they were born.
 */
export function BirthDetailsScreen({ onSaved }: { onSaved: () => void }): React.JSX.Element {
  const theme = useTheme();
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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

    // Offer smaller settlements around the chosen point. Silent on failure —
    // this is a refinement, and the chosen place is already usable.
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

  const save = async (): Promise<void> => {
    if (!place) return;

    setBusy(true);
    setError(null);

    try {
      await api.post<BirthProfile>('/profiles', {
        displayName: user?.displayName ?? 'My chart',
        birthDate: date.trim(),
        ...(time.trim() ? { birthTime: time.trim() } : {}),
        placeName: [place.name, place.region, place.country].filter(Boolean).join(', '),
        countryCode: place.countryCode,
        timezone: place.timezone,
        latitude: place.latitude,
        longitude: place.longitude,
        isSelf: true,
      });
      onSaved();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Could not save. Check your connection.',
      );
    } finally {
      setBusy(false);
    }
  };

  const ready = /^\d{4}-\d{2}-\d{2}$/.test(date.trim()) && place !== null;

  return (
    <Screen scroll avoidKeyboard>
      <View style={[styles.content, { padding: theme.spacing.xl }]}>
        <Text variant="display">Your birth</Text>
        <Text variant="body" tone="muted" style={styles.intro}>
          The time shapes your houses and rising sign. Leave it blank if you do not know it.
        </Text>

        <TextField
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="1985-07-22"
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
        />

        <TextField
          label="Time"
          value={time}
          onChangeText={setTime}
          placeholder="14:20"
          keyboardType="numbers-and-punctuation"
          autoCorrect={false}
          hint="24-hour clock"
        />

        <TextField
          label="Place"
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
          <Card style={styles.chosen}>
            <View style={styles.chosenRow}>
              <Feather name="map-pin" size={16} color={theme.colors.primary} />
              <View style={styles.chosenText}>
                <Text variant="bodyStrong">{place.name}</Text>
                <Text variant="caption" tone="muted">
                  {[place.region, place.country].filter(Boolean).join(', ')} · {place.timezone}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        {nearby.length > 0 ? (
          <View style={styles.nearby}>
            <Text variant="label" tone="muted" style={styles.nearbyLabel}>
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

        {error ? (
          <View
            style={[
              styles.banner,
              {
                backgroundColor: theme.colors.dangerSurface,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
              },
            ]}
          >
            <Text variant="caption" tone="danger">
              {error}
            </Text>
          </View>
        ) : null}

        <Button
          label="Continue"
          onPress={() => { void save(); }}
          loading={busy}
          disabled={!ready}
          block
          style={styles.submit}
        />
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
        {
          borderBottomColor: theme.colors.border,
          paddingVertical: theme.spacing.md,
          opacity: pressed ? 0.6 : 1,
        },
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
  content: { flex: 1, justifyContent: 'center' },
  intro: { marginTop: 8, marginBottom: 28 },
  spinner: { marginVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: { flex: 1 },
  chosen: { marginTop: 4, marginBottom: 8 },
  chosenRow: { flexDirection: 'row', alignItems: 'center' },
  chosenText: { marginLeft: 10, flex: 1 },
  nearby: { marginTop: 16 },
  nearbyLabel: { marginBottom: 4 },
  banner: { marginTop: 16 },
  submit: { marginTop: 24 },
});
