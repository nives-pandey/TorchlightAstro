# Wiring Google Sign-In

Everything in the code is built. What is missing is an OAuth client in Google
Cloud, which only you can create — it belongs to your Google account.

Roughly ten minutes.

---

## The values you will need

| | |
|---|---|
| Package name | `com.torchlightmobile` |
| Release SHA-1 | `DD:DF:CB:3B:7E:0D:43:FA:57:E5:10:51:67:E1:E7:A1:31:04:84:E6` |
| Debug SHA-1 | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |

The release fingerprint comes from `android/app/torchlight-release.keystore`.
Regenerating that keystore changes the fingerprint and breaks sign-in until the
OAuth client is updated to match — one more reason the keystore must be backed
up rather than recreated.

---

## 1. Create the project

At [console.cloud.google.com](https://console.cloud.google.com), create a
project called **Torchlight**.

## 2. Configure the consent screen

**APIs & Services → OAuth consent screen**

- User type: **External**
- App name: **Torchlight**
- Support email and developer contact: your address
- Scopes: leave the defaults. The app reads a name and an email address and
  asks for nothing else, so no scope needs adding.
- Publishing status: **Testing** is fine to start. Add your own address under
  Test users. Move to Production before real testers arrive, or sign-in fails
  for anyone not on that list.

## 3. Create two OAuth clients

**APIs & Services → Credentials → Create credentials → OAuth client ID**

Both are required, and the reason is easy to get wrong.

### The Android client

- Type: **Android**
- Package name: `com.torchlightmobile`
- SHA-1: the **release** fingerprint above

This authorises the app to ask for a token. Add a second Android client with
the **debug** fingerprint if you want sign-in to work in local development
builds too.

### The Web client

- Type: **Web application**
- Name: anything — "Torchlight backend" reads clearly

**This is the one whose id goes in the code.** The Android client authorises the
request; the token itself is minted for the web client, and that is the audience
the backend verifies. Putting the Android id in the app produces a token the
server correctly refuses, and the error message does not make the cause obvious.

Copy the **web** client id. It looks like
`123456789-abcdef.apps.googleusercontent.com`.

---

## 4. Give me the web client id

Two places need it:

- `apps/mobile/src/config.ts` — `GOOGLE_CLIENT_ID`
- Vercel — `GOOGLE_CLIENT_ID` as a production environment variable

The client id is not a secret. It is public by design: the security comes from
Google signing the token and the backend checking that signature, not from the
id being hidden.

---

## What happens then

The button stops saying it is unconfigured. A first sign-in creates the account
silently; a returning user is matched on Google's stable subject rather than on
email, since an email can be reassigned and a subject cannot.

An existing password account with the same verified address is linked to the
Google identity rather than duplicated, so anyone who signed up before this
keeps their charts.
