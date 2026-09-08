# Sharing a build with testers

Three ways to put Torchlight on someone else's phone, cheapest first.

## 1. Send the APK directly

Fine for a handful of people you know.

```sh
cd apps/mobile/android
ANDROID_HOME=~/Library/Android/sdk ./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk` (~62 MB).

Share it by Drive, WhatsApp, or AirDrop. The tester taps it, and Android asks
once to allow installs from that app. No account needed on either side.

**Limits.** Nobody gets updates automatically — every new version is another
file to send. There is no crash reporting and no record of who installed what.
Android also shows a "scanned by Play Protect" warning for apps from outside the
store, which reads as alarming to someone who does not know you.

## 2. Firebase App Distribution — the right answer for clients

Free, unlimited testers, and the closest thing to a real release without going
through review.

```sh
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute \
  apps/mobile/android/app/build/outputs/apk/release/app-release.apk \
  --app <your firebase app id> \
  --groups "clients" \
  --release-notes "What changed in this build"
```

Testers get an email, install once, and every later build arrives as an update
notification. You see who installed which version, and crashes come back with
stack traces.

Setup is a Firebase project and an Android app registered against the package
name `com.torchlightmobile` — about ten minutes, once.

## 3. Play Store internal testing

Use this when you are close to launching.

```sh
cd apps/mobile/android
ANDROID_HOME=~/Library/Android/sdk ./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab` — Play takes an AAB,
not an APK.

Up to 100 testers by email, installing through the Play Store itself with no
security warnings. Needs a Google Play developer account (a one-off $25) and a
privacy policy URL. Internal testing skips the multi-week review that closed
testing requires.

---

## The signing key

`android/app/torchlight-release.keystore` and `android/keystore.properties` are
both gitignored, and between them they are the only things that can publish an
update to this app.

**Back them up somewhere that survives a lost laptop.** A password manager
attachment or an encrypted drive — not the repository, and not a Slack message
to yourself.

Losing the key cannot be recovered from. Android identifies an app by its
signature, so a new key is a new app: a new listing, and no upgrade path for
anyone who already installed the old one.

A build made without these files still works. Gradle falls back to the debug key,
which is fine for running locally and rejected by Play.

## Version numbers

`versionCode` must increase for every build a tester receives, or the install
is refused as a downgrade. `versionName` is the human-readable string.

Both live in `android/app/build.gradle`:

```groovy
versionCode 2
versionName "1.0.1"
```
