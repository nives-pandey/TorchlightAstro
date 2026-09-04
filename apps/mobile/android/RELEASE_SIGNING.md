# Release signing

Torchlight's release APK is currently signed with the **debug keystore** that
ships with the React Native scaffold. That is fine for installing on your own
device, and it is a hard blocker for the Play Store: Google rejects any upload
signed with the shared debug key, because every developer has the same one.

## Why this needs care

An Android app's signing key is permanent. Once a version signed with a key is
published, every future update must be signed with that same key. Losing it
means the app can never be updated — a new key is a new app, with a new listing
and none of the existing installs.

So the key is generated once, backed up somewhere durable, and never committed.

## Generating the key

```sh
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore torchlight-release.keystore \
  -alias torchlight \
  -keyalg RSA -keysize 4096 -validity 10000
```

`keytool` asks for a password and for identifying details. Use a password from
a password manager, not one typed from memory.

Put the file at `android/app/torchlight-release.keystore`. Both `.gitignore`
files already exclude `*.keystore` (with an explicit exception for
`debug.keystore`), so it will not be committed.

## Wiring it in

Create `android/keystore.properties` — also already gitignored:

```properties
storeFile=torchlight-release.keystore
storePassword=<the password>
keyAlias=torchlight
keyPassword=<the password>
```

Then in `android/app/build.gradle`, replace the release `signingConfig` so it
reads from that file rather than using the debug key, falling back to debug when
the file is absent so a fresh clone still builds:

```groovy
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file("keystore.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

signingConfigs {
    release {
        if (keystorePropertiesFile.exists()) {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
}

buildTypes {
    release {
        signingConfig keystorePropertiesFile.exists()
            ? signingConfigs.release
            : signingConfigs.debug
        // ...
    }
}
```

## Backing it up

Store the keystore file and its password separately from this repository, in
something that survives a lost laptop. Google Play App Signing adds a second
layer — Google holds the key that actually signs what users download — but the
upload key generated above is still yours to keep.

## For the Play Store

Store submission wants an **AAB**, not an APK:

```sh
./gradlew bundleRelease
```

The output lands at `app/build/outputs/bundle/release/app-release.aab`.
