---
modificationDate: March 09, 2026
title: Using in-app purchases
description: Learn about how to use in-app purchases in your Expo app.
---

# Using in-app purchases

Learn about how to use in-app purchases in your Expo app.

In-app purchases (IAP) are transactions within a mobile or desktop application where users can buy digital goods or additional features. This guide provides a list of popular libraries and tutorials for implementing IAP in your Expo app.

> In-app purchase libraries require configuring custom native code. Native code is not configurable when using Expo Go. Instead, create a [development build](/develop/development-builds/introduction), which allows using a native library in your project.

## Tutorial

[Watch: How to Implement In-App Purchases in Expo](https://www.youtube.com/watch?v=R3fLKC-2Qh0) — Set up in-app purchases and subscriptions in your Expo app using RevenueCat.

  

[Expo In-App Purchase Tutorial](https://www.revenuecat.com/blog/engineering/expo-in-app-purchase-tutorial/) — The getting started guide for in-app purchases and subscriptions with react-native-purchases library and RevenueCat. — react-native-purchases

## Libraries

The following libraries provide robust support for in-app purchase functionality and out-of-the-box compatibility with Expo apps using [CNG](/workflow/continuous-native-generation) and [Config Plugins](/config-plugins/introduction) for seamless integration in your app.

[react-native-purchases](https://github.com/RevenueCat/react-native-purchases) — react-native-purchases — An open-source framework that provides a wrapper around Google Play Billing and StoreKit APIs, and integration with RevenueCat services supporting in-app purchases. It enables product management, analytics, and simplified workflows for in-app purchase requirements that may extend beyond your client code, such as validating purchases on an app's backend.

[expo-iap](https://github.com/hyochan/expo-iap) — expo-iap — A React Native library for in-app purchases that works with development builds.
