---
modificationDate: December 12, 2025
title: 'Distribution: Overview'
description: An overview of submitting an app to the app stores or with the internal distribution.
---

# Distribution: Overview

An overview of submitting an app to the app stores or with the internal distribution.

Get your app into the hands of users by submitting it to the app stores or with [Internal Distribution](/build/internal-distribution).

```sh
npm i -g eas-cli
eas build --auto-submit
eas submit
```

You can run `eas build --auto-submit` with [EAS CLI](/eas) to build your app and automatically upload the binary for distribution on the Google Play Store and Apple App Store.

This automatically manages **all native code signing** for Android and iOS for any React Native app. Advanced features such as payments, notifications, universal links, and iCloud can be automatically enabled based on your [config plugins](/config-plugins/introduction) or native entitlements, meaning no more wrestling with slow portals to get libraries set up correctly.

### Get started

[Submit to the Google Play Store](/submit/android) — Learn how to submit an Android app to the Google Play Store.

[Submit to the Apple App Store](/submit/ios) — Learn how to submit an iOS or an iPadOS app to the Apple App Store from any operating system.

[Internal Distribution](/build/internal-distribution) — Share your mobile app internally with testers using AdHoc builds.

[Publish websites](/guides/publishing-websites) — Export your website and upload to any web host.

[OTA updates](/eas-update/introduction) — Send over-the-air updates to your users instantly.
