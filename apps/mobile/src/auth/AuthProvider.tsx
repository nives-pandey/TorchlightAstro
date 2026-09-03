/**
 * Torchlight — session state
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 *
 * PROPRIETARY AND CONFIDENTIAL. Unauthorised copying, distribution, or use of
 * this file, via any medium, is strictly prohibited. See LICENSE.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as Keychain from 'react-native-keychain';

import { api, configureClient } from '../api/client';

/**
 * Who is signed in, and the tokens that prove it.
 *
 * Tokens live in the device keychain rather than AsyncStorage. AsyncStorage is
 * plain files in the app sandbox — readable on a rooted device and included in
 * some backup paths — while the keychain is hardware-backed where the device
 * supports it. A refresh token is a thirty-day credential, so where it rests
 * matters.
 *
 * The access token is held in memory as well as stored, because it is read on
 * every request and a keychain round trip per call would be wasteful.
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  primaryBirthProfileId: string | null;
  createdAt: string;
}

interface Session {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True until the stored session has been checked on launch. */
  restoring: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Refreshes the cached user after something changes it server-side. */
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const KEYCHAIN_SERVICE = 'app.torchlight.session';

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restoring, setRestoring] = useState(true);

  // Refs rather than state: the API client reads these on every request, and a
  // state read would capture a stale closure.
  const accessToken = useRef<string | null>(null);
  const refreshToken = useRef<string | null>(null);

  const persist = useCallback(async (session: Session | null): Promise<void> => {
    accessToken.current = session?.accessToken ?? null;
    refreshToken.current = session?.refreshToken ?? null;

    if (!session) {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
      setUser(null);
      return;
    }

    // The keychain stores a username/password pair, so the refresh token goes
    // in the password slot and the user id identifies which account it belongs
    // to. Only the refresh token is persisted: the access token expires in
    // fifteen minutes and can always be obtained from it.
    await Keychain.setGenericPassword(session.user.id, session.refreshToken, {
      service: KEYCHAIN_SERVICE,
    });

    setUser(session.user);
  }, []);

  /**
   * Exchanges the stored refresh token for a new session.
   *
   * Returns the new access token so the API client can retry the request that
   * triggered it. A failure clears the session entirely — a refresh token that
   * no longer works cannot be recovered from, and leaving it in place would
   * mean every subsequent request failing the same way.
   */
  const refresh = useCallback(async (): Promise<string | null> => {
    const stored = refreshToken.current;
    if (!stored) return null;

    try {
      const session = await api.post<Session>('/auth/refresh', { refreshToken: stored }, true);
      await persist(session);
      return session.accessToken;
    } catch {
      await persist(null);
      return null;
    }
  }, [persist]);

  // Wired once, before any screen can make a request.
  useEffect(() => {
    configureClient(async () => accessToken.current, refresh);
  }, [refresh]);

  // On launch, turn a stored refresh token back into a live session.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
        if (credentials) {
          refreshToken.current = credentials.password;
          await refresh();
        }
      } catch {
        // A keychain that cannot be read is the same as having no session.
        // Signing in again is the recovery, and it always works.
      } finally {
        if (!cancelled) setRestoring(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string): Promise<void> => {
      const session = await api.post<Session>(
        '/auth/sign-up',
        { email, password, displayName },
        true,
      );
      await persist(session);
    },
    [persist],
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      const session = await api.post<Session>('/auth/sign-in', { email, password }, true);
      await persist(session);
    },
    [persist],
  );

  const signOut = useCallback(async (): Promise<void> => {
    const stored = refreshToken.current;

    // Revoke server-side first, but do not let a network failure trap someone
    // in a signed-in state. The local session is cleared either way.
    if (stored) {
      try {
        await api.post('/auth/sign-out', { refreshToken: stored }, true);
      } catch {
        // Ignored deliberately — see above.
      }
    }

    await persist(null);
  }, [persist]);

  const reloadUser = useCallback(async (): Promise<void> => {
    if (!accessToken.current) return;
    setUser(await api.get<AuthUser>('/auth/me'));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, restoring, signUp, signIn, signOut, reloadUser }),
    [user, restoring, signUp, signIn, signOut, reloadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
